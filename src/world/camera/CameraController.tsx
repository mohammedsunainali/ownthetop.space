import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentRef } from "react";
import { Box3, TOUCH, Vector3 } from "three";
import { fitRectangularBounds } from "@/world/camera/rectangular-framing";
import { RECTANGULAR_AD, RECTANGULAR_TOWER } from "@/world/tower/rectangular-layout";
import { rectangularTextLayout } from "@/world/tower/rectangular-signs";
import type { Listing } from "@/domain/listing";
import type { TowerId } from "@/domain/tower";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useWorldQuality } from "@/hooks/use-world-quality";
import { useWorldStore } from "@/state/world-store";
import { getCrownHeight, getFloorY, getTowerHeight, towerVisuals } from "@/world/tower/tower-layout";

export function clampTowerTravel(y: number, floorCount: number): number {
  return Math.max(1.1, Math.min(getTowerHeight(floorCount) + getCrownHeight(floorCount) - 0.7, y));
}
export function towerCameraWorldY(towerId: TowerId, localY: number): number {
  const tower = towerVisuals[towerId];
  return tower.position[1] + localY * tower.scale;
}
export function shouldRunIntro(reducedMotion: boolean): boolean { return !reducedMotion; }
export function focusedWheelAction(event: Pick<WheelEvent, "ctrlKey" | "metaKey"> & {shiftKey?:boolean}): "zoom" | "travel" {
  return event.shiftKey && !event.ctrlKey && !event.metaKey ? "travel" : "zoom";
}
export function yieldCameraToManualControl(intro: { interrupted: boolean }, transition: { current: number }, manual: { current: boolean }): void {
  intro.interrupted = true;
  transition.current = 0;
  manual.current = true;
}

interface CameraControllerProps {
  selectedListing: Listing | null;
  floorCounts: Record<TowerId, number>;
  introReady: boolean;
}

export function CameraController({ selectedListing, floorCounts, introReady }: CameraControllerProps) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const exploded = useWorldStore((state) => state.floorsExploded);
  const selectedTowerId = useWorldStore((state) => state.selectedTowerId);
  const cameraDistance = useWorldStore((state) => state.cameraDistance);
  const cameraOrbitStep = useWorldStore((state) => state.cameraOrbitStep);
  const cameraResetVersion = useWorldStore((state) => state.cameraResetVersion);
  const towerTravelY = useWorldStore((state) => state.towerTravelY);
  const floorPreview = useWorldStore((state) => state.floorPreview);
  const travelTowerBy = useWorldStore((state) => state.travelTowerBy);
  const zoomBy = useWorldStore((state) => state.zoomBy);
  const gl = useThree((state) => state.gl);
  const reducedMotion = useReducedMotion();
  const mobile = useWorldQuality();
  const transition = useRef(1);
  const intro = useRef({ elapsed: 0, interrupted: false });
  const manual = useRef(false);
  const previousDestination = useRef<{ position: Vector3; target: Vector3 } | null>(null);
  const previousAnchor = useRef<string | null>(null);
  const previousDistance = useRef(cameraDistance);
  const previousOrbitStep = useRef(cameraOrbitStep);
  const diagnosticsElapsed=useRef(0);
  const [safeViewport,setSafeViewport]=useState({left:16,right:size.width-16,top:90,bottom:size.height-75});
  useLayoutEffect(()=>{
    const measure=()=>{
      const canvas=gl.domElement.getBoundingClientRect();
      let left=16,right=canvas.width-16,top=75,bottom=canvas.height-75;
      const rect=(selector:string)=>{const element=document.querySelector(selector);if(!(element instanceof HTMLElement)||element.offsetWidth===0||getComputedStyle(element).visibility!=="visible")return null;const box=element.getBoundingClientRect();return {left:box.left-canvas.left,right:box.right-canvas.left,top:box.top-canvas.top,bottom:box.bottom-canvas.top};};
      const claim=rect(".claim-panel"),drawer=rect(".profile-drawer"),hud=rect(".world-controls");
      if(claim)top=Math.max(top,claim.bottom+22);
      if(hud && !mobile)right=Math.min(right,hud.left-18);
      if(drawer){if(mobile)bottom=Math.min(bottom,drawer.top-16);else right=Math.min(right,drawer.left-24);}
      if(cameraMode==="overview"&&!mobile){const metrics=rect(".metrics-panel");if(metrics)left=Math.max(left,metrics.right+18);}
      const next={left,right:Math.max(left+220,right),top,bottom:Math.max(top+200,bottom)};
      setSafeViewport(prior=>Object.keys(next).every(key=>prior[key as keyof typeof prior]===next[key as keyof typeof next])?prior:next);
    };
    measure(); const observer=new ResizeObserver(measure);observer.observe(gl.domElement);
    for(const selector of [".claim-panel",".profile-drawer",".world-controls"]){const element=document.querySelector(selector);if(element)observer.observe(element);}
    const mutations=new MutationObserver(measure);const shell=document.querySelector(".app-shell");if(shell)mutations.observe(shell,{attributes:true,attributeFilter:["class"]});
    document.addEventListener("transitionend",measure);
    return ()=>{observer.disconnect();mutations.disconnect();document.removeEventListener("transitionend",measure);};
  },[cameraMode,selectedListing,floorPreview,introReady,mobile,size,gl]);

  const cancelScriptedMotion = () => {
    yieldCameraToManualControl(intro.current, transition, manual);
  };

  useEffect(() => {
    const interrupt = () => { yieldCameraToManualControl(intro.current, transition, manual); };
    gl.domElement.addEventListener("pointerdown", interrupt);
    gl.domElement.addEventListener("touchstart", interrupt, { passive: true });
    gl.domElement.addEventListener("wheel", interrupt, { passive: true });
    return () => { gl.domElement.removeEventListener("pointerdown", interrupt); gl.domElement.removeEventListener("touchstart", interrupt); gl.domElement.removeEventListener("wheel", interrupt); };
  }, [gl]);

  useEffect(() => {
    const element = gl.domElement;
    const onWheel = (event: WheelEvent) => {
      const state = useWorldStore.getState();
      if (state.cameraMode === "overview") return;
      yieldCameraToManualControl(intro.current, transition, manual);
      event.stopImmediatePropagation();
      if (focusedWheelAction(event) === "zoom") {
        event.preventDefault();
        zoomBy(event.deltaY * 0.0018);
        return;
      }
      event.preventDefault();
      const id = state.selectedTowerId ?? "companies";
      const count = floorCounts[id];
      const start = state.cameraMode === "rooftop" ? getTowerHeight(count, exploded) + 2 : state.selectedListingId && selectedListing ? getFloorY(selectedListing.rank, count, exploded) + 0.2 : getFloorY(1, count, exploded);
      travelTowerBy(-event.deltaY * 0.007, 1.1, getTowerHeight(count, exploded) + getCrownHeight(count) - 0.7, start);
    };
    element.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => element.removeEventListener("wheel", onWheel, true);
  }, [exploded, floorCounts, gl, selectedListing, travelTowerBy, zoomBy]);

  const destination = useMemo(() => {
    const heightFor=(count:number)=>getTowerHeight(count,exploded);
    const floorFor=(rank:number,count:number)=>getFloorY(rank,count,exploded);
    const tallestHeight = heightFor(Math.max(...Object.values(floorCounts)));
    const top=tallestHeight+getCrownHeight(Math.max(...Object.values(floorCounts)));
    const bounds=new Box3(new Vector3(-25.5,0,-25.5),new Vector3(25.5,top,25.5));
    const usableWidth=safeViewport.right-safeViewport.left;
    const usableHeight=safeViewport.bottom-safeViewport.top;
    const occupied=[new Box3(new Vector3(-23,0,-23),new Vector3(23,0,23)),...Object.entries(floorCounts).filter(([,count])=>count>0).map(([id,count])=>{const visual=towerVisuals[id as TowerId];return new Box3(new Vector3(visual.position[0]-3.9,0,visual.position[2]-3.3),new Vector3(visual.position[0]+3.9,heightFor(count)+getCrownHeight(count),visual.position[2]+3.3));})];
    const overview=fitRectangularBounds(bounds,new Vector3(0.13,0.30,1),size.width,size.height,usableWidth,usableHeight,42,occupied);
    const shiftX=(size.width-safeViewport.left-safeViewport.right)/size.width;
    const shiftY=(safeViewport.top+safeViewport.bottom-size.height)/size.height;
    const shift=(fit:ReturnType<typeof fitRectangularBounds>,surfaceDepth=0)=>fit.center.clone().addScaledVector(fit.right,(fit.distance-surfaceDepth)*Math.tan(42*Math.PI/360)*size.width/size.height*shiftX).addScaledVector(fit.up,(fit.distance-surfaceDepth)*Math.tan(42*Math.PI/360)*shiftY);
    let target=shift(overview);
    let offset=overview.forward.clone().multiplyScalar(overview.distance);

    if (cameraMode !== "overview") {
      const towerId = selectedListing?.towerId ?? selectedTowerId ??
        (cameraMode === "companiesTower" ? "companies" : cameraMode === "productsTower" ? "products" : "people");
      const tower = towerVisuals[towerId];
      const count = floorCounts[towerId];
      const rooftop=cameraMode==="rooftop";
      const localY = towerTravelY ?? (rooftop ? heightFor(count)+1.5 : cameraMode==="topFloor" ? floorFor(1,count) : floorPreview?.towerId===towerId ? floorFor(floorPreview.media.rank,count) : selectedListing ? floorFor(selectedListing.rank,count) : floorFor(1,count));
      const center=new Vector3(tower.position[0],towerCameraWorldY(towerId,localY),tower.position[2]);
      const extent=rooftop?new Vector3(4,2.3,3.4):new Vector3(3.5,2,2.3);
      const fit=fitRectangularBounds(new Box3(center.clone().sub(extent),center.clone().add(extent)),rooftop?new Vector3(0.35,0.6,1):new Vector3(0.035,0.025,1),size.width,size.height,usableWidth,usableHeight);
      target=shift(fit,extent.z);
      offset=fit.forward.clone().multiplyScalar(fit.distance);
    }

    const angle = cameraOrbitStep * (Math.PI / 5);
    offset.applyAxisAngle(new Vector3(0, 1, 0), angle).multiplyScalar(cameraDistance);

    return { position: target.clone().add(offset), target };
  }, [cameraDistance, cameraMode, cameraOrbitStep, floorCounts, floorPreview, selectedListing, selectedTowerId, towerTravelY,size,safeViewport,exploded]);

  const anchor = `${cameraMode}|${selectedTowerId}|${selectedListing?.id ?? ""}|${floorPreview?.media.id ?? ""}|${cameraResetVersion}`;
  useEffect(() => {
    const prior = previousDestination.current;
    const anchorChanged = previousAnchor.current !== anchor;
    if (prior && (cameraDistance !== previousDistance.current || cameraOrbitStep !== previousOrbitStep.current)) {
      // Toolbar actions have the same authority as pointer and wheel input.
      yieldCameraToManualControl(intro.current, transition, manual);
    }
    if (anchorChanged) {
      manual.current = false;
      transition.current = 1;
    } else if (manual.current && prior && controls.current) {
      // Travel and toolbar zoom/rotate operate on the user's current orbit, not a stale scripted view.
      const control = controls.current;
      const offset = camera.position.clone().sub(control.target);
      offset.multiplyScalar(cameraDistance / previousDistance.current);
      offset.applyAxisAngle(new Vector3(0, 1, 0), (cameraOrbitStep - previousOrbitStep.current) * Math.PI / 5);
      control.target.add(destination.target.clone().sub(prior.target));
      destination.position.copy(control.target).add(offset);
      destination.target.copy(control.target);
      manual.current=false;
      transition.current = 1;
    } else {
      transition.current = 1;
    }
    previousDestination.current = destination;
    previousAnchor.current = anchor;
    previousDistance.current = cameraDistance;
    previousOrbitStep.current = cameraOrbitStep;
  }, [anchor, camera, cameraDistance, cameraOrbitStep, destination]);

  useFrame(({gl:renderer,camera:frameCamera}, delta) => {
    const far=Math.max(300,(getTowerHeight(Math.max(...Object.values(floorCounts)),exploded)+getCrownHeight(floorCounts.companies))*6);
    if(frameCamera.far!==far){frameCamera.far=far;frameCamera.updateProjectionMatrix();}
    diagnosticsElapsed.current+=delta;
    if((process.env.NODE_ENV==="development"||new URLSearchParams(window.location.search).get("diagnostics")==="1")&&diagnosticsElapsed.current>1){
      diagnosticsElapsed.current=0;
      const towerId=selectedListing?.towerId??selectedTowerId??"companies";
      const visual=towerVisuals[towerId];
      const point=new Vector3(visual.position[0],getFloorY(selectedListing?.rank??1,floorCounts[towerId]),visual.position[2]+2.225).project(camera);
      const floorY=getFloorY(selectedListing?.rank??1,floorCounts[towerId],exploded);
      const project=(x:number)=>new Vector3(visual.position[0]+x,floorY,visual.position[2]+RECTANGULAR_TOWER.facadeZ).project(camera);
      const left=project(-RECTANGULAR_TOWER.clearWidth/2),right=project(RECTANGULAR_TOWER.clearWidth/2);
      const width=Math.abs(right.x-left.x)*size.width/2;
      const context=document.createElement("canvas").getContext("2d");
      const layout=selectedListing&&context?rectangularTextLayout(context,selectedListing):null;
      const projection={facadeWidth:width,logo:width*RECTANGULAR_AD.logo.size/RECTANGULAR_AD.width,name:width*(layout?.name.lines[0].size??RECTANGULAR_AD.nameSize)/RECTANGULAR_AD.width,subtitle:width*(layout?.subtitle[0]?.size??RECTANGULAR_AD.subtitleSize)/RECTANGULAR_AD.width,rank:width*(layout?.rank.size??RECTANGULAR_AD.statsSize)/RECTANGULAR_AD.width,amount:width*(layout?.amount.size??RECTANGULAR_AD.statsSize)/RECTANGULAR_AD.width};
      renderer.domElement.dataset.ottCamera=JSON.stringify({safeViewport,size,position:camera.position.toArray(),target:controls.current?.target.toArray(),destination:destination.target.toArray(),floorCenter:[(point.x+1)*size.width/2,(1-point.y)*size.height/2],projection});
    }
    if (cameraMode !== "overview") intro.current.interrupted = true;
    const introducing = !intro.current.interrupted && cameraMode === "overview" && (!introReady || (shouldRunIntro(reducedMotion) && intro.current.elapsed < 2.6));
    if (introducing) {
      const aerialTarget = destination.target.clone().add(new Vector3(0, -3, 0));
      const aerialPosition = destination.position.clone().add(new Vector3(0, 13, 8));
      if (!introReady) {
        camera.position.copy(aerialPosition);
        controls.current?.target.copy(aerialTarget);
        controls.current?.update();
        return;
      }
      intro.current.elapsed = Math.min(2.6, intro.current.elapsed + delta);
      const t = intro.current.elapsed / 2.6;
      const eased = t * t * (3 - 2 * t);
      camera.position.copy(aerialPosition.lerp(destination.position, eased));
      controls.current?.target.copy(aerialTarget.lerp(destination.target, eased));
      controls.current?.update();
      if (t === 1) transition.current = 0;
      return;
    }
    if (manual.current || transition.current <= 0.001) return;

    const alpha = reducedMotion ? 1 : 1 - Math.exp(-delta * 5.5);
    camera.position.lerp(destination.position, alpha);
    controls.current?.target.lerp(destination.target, alpha);
    controls.current?.update();
    transition.current *= 1 - alpha;
  });

  const framingDistance=destination.position.distanceTo(destination.target)/cameraDistance;

  return (
    <OrbitControls
      ref={controls}
      onStart={cancelScriptedMotion}
      makeDefault
      enableDamping={!reducedMotion}
      dampingFactor={0.08}
      minDistance={cameraMode === "overview" ? Math.max(12,framingDistance*0.22) : 5.5}
      maxDistance={framingDistance*1.3}
      enableZoom
      enableRotate
      zoomSpeed={0.8}
      rotateSpeed={0.7}
      touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_ROTATE }}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, 4.4, 0]}
    />
  );
}
