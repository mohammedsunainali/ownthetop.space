import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentRef } from "react";
import { Box3, PerspectiveCamera, TOUCH, Vector3 } from "three";
import { fitRectangularBounds, isBottomOverlay } from "@/world/camera/rectangular-framing";
import { RECTANGULAR_AD, RECTANGULAR_TOWER } from "@/world/tower/rectangular-layout";
import { rectangularTextLayout } from "@/world/tower/rectangular-signs";
import type { Listing } from "@/domain/listing";
import type { TowerId } from "@/domain/tower";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useWorldStore } from "@/state/world-store";
import { getCrownHeight, getFloorY, getTowerHeight, towerVisuals } from "@/world/tower/tower-layout";
import { facadeOccluded } from "@/world/environment/vegetation-layout";
import { advertisementSamples, facingAdvertisement, inspectionBlocked, safeInspectionOffset, towerWorldBounds } from "./district-sightlines";
import { SIDE_AD, sideTextLayout } from "@/world/tower/side-signs";
import { recordNavigationSample } from "@/world/navigation-performance";
import { districtBuilding } from "@/world/environment/district-inventory";

export function clampTowerTravel(y: number, floorCount: number): number {
  return Math.max(1.1, Math.min(getTowerHeight(floorCount) + getCrownHeight(floorCount) - 0.7, y));
}
export function towerCameraWorldY(towerId: TowerId, localY: number): number {
  const tower = towerVisuals[towerId];
  return tower.position[1] + localY * tower.scale;
}
export function shouldRunIntro(reducedMotion: boolean): boolean { return !reducedMotion; }
export function focusedWheelAction(event: Pick<WheelEvent, "ctrlKey" | "metaKey"> & {shiftKey?:boolean}): "zoom" | "travel" {
  return event.shiftKey || event.ctrlKey || event.metaKey ? "zoom" : "travel";
}
export function yieldCameraToManualControl(intro: { interrupted: boolean }, transition: { current: number }, manual: { current: boolean }): void {
  intro.interrupted = true;
  transition.current = 0;
  manual.current = true;
}
/** Sub-threshold floor wheel events must not cancel an already accepted step. */
export function beginFocusedWheel(action: "zoom" | "travel", intro: { interrupted: boolean }, transition: { current: number }, manual: { current: boolean }): void {
  intro.interrupted = true;
  if (action === "zoom") yieldCameraToManualControl(intro, transition, manual);
}

interface CameraControllerProps {
  selectedListing: Listing | null;
  listingsByTower: Record<TowerId, readonly Listing[]>;
  floorCounts: Record<TowerId, number>;
  introReady: boolean;
}

export function CameraController({ selectedListing, listingsByTower, floorCounts, introReady }: CameraControllerProps) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const selectedDistrictBuildingId=useWorldStore(state=>state.selectedDistrictBuildingId);
  const exploded = useWorldStore((state) => state.floorsExploded);
  const selectedTowerId = useWorldStore((state) => state.selectedTowerId);
  const cameraDistance = useWorldStore((state) => state.cameraDistance);
  const cameraOrbitStep = useWorldStore((state) => state.cameraOrbitStep);
  const cameraResetVersion = useWorldStore((state) => state.cameraResetVersion);
  const towerTravelY = useWorldStore((state) => state.towerTravelY);
  const floorPreview = useWorldStore((state) => state.floorPreview);
  const profileVisible = useWorldStore((state) => state.profileVisible);
  const travelFloors = useWorldStore((state) => state.travelFloors);
  const wheelTravel = useRef({ total: 0, time: 0 });
  const pendingInput = useRef<number | null>(null);
  const zoomBy = useWorldStore((state) => state.zoomBy);
  const gl = useThree((state) => state.gl);
  const reducedMotion = useReducedMotion();
  const transition = useRef(1);
  const intro = useRef({ elapsed: 0, interrupted: false });
  const manual = useRef(false);
  const previousDestination = useRef<{ position: Vector3; target: Vector3 } | null>(null);
  const previousAnchor = useRef<string | null>(null);
  const previousDistance = useRef(cameraDistance);
  const previousOrbitStep = useRef(cameraOrbitStep);
  const diagnosticsElapsed=useRef(0);
  const collisionElapsed=useRef(0);
  const [safeViewport,setSafeViewport]=useState({left:16,right:size.width-16,top:90,bottom:size.height-75});
  useLayoutEffect(()=>{
    if(!(camera instanceof PerspectiveCamera))return;
    camera.setViewOffset(size.width,size.height,(size.width-safeViewport.left-safeViewport.right)/2,(size.height-safeViewport.top-safeViewport.bottom)/2,size.width,size.height);
    return ()=>camera.clearViewOffset();
  },[camera,size.width,size.height,safeViewport]);
  useLayoutEffect(()=>{
    const measure=()=>{
      const canvas=gl.domElement.getBoundingClientRect();
      let left=16,right=canvas.width-16,top=75,bottom=canvas.height-75;
      const rect=(selector:string)=>{const element=document.querySelector(selector);if(!(element instanceof HTMLElement)||element.offsetWidth===0||getComputedStyle(element).visibility!=="visible")return null;const box=element.getBoundingClientRect();return {left:box.left-canvas.left,right:box.right-canvas.left,top:box.top-canvas.top,bottom:box.bottom-canvas.top};};
      const claim=rect(".claim-panel"),drawer=rect(".profile-drawer"),hud=rect(".world-controls");
      if(claim)top=Math.max(top,claim.bottom+22);
      if(hud){if(isBottomOverlay(hud,canvas.width))bottom=Math.min(bottom,hud.top-16);else right=Math.min(right,hud.left-18);}
      if(drawer){if(isBottomOverlay(drawer,canvas.width))bottom=Math.min(bottom,drawer.top-16);else right=Math.min(right,drawer.left-24);}
      if(cameraMode==="overview"&&canvas.width>600){const metrics=rect(".metrics-panel");if(metrics)left=Math.max(left,metrics.right+18);}
      const next={left,right:Math.max(left+220,right),top,bottom:Math.max(top+200,bottom)};
      setSafeViewport(prior=>Object.keys(next).every(key=>prior[key as keyof typeof prior]===next[key as keyof typeof next])?prior:next);
    };
    measure(); const observer=new ResizeObserver(measure);observer.observe(gl.domElement);
    for(const selector of [".claim-panel",".profile-drawer",".world-controls"]){const element=document.querySelector(selector);if(element)observer.observe(element);}
    const mutations=new MutationObserver(measure);const shell=document.querySelector(".app-shell");if(shell)mutations.observe(shell,{attributes:true,attributeFilter:["class"],childList:true,subtree:true});
    document.addEventListener("transitionend",measure);
    return ()=>{observer.disconnect();mutations.disconnect();document.removeEventListener("transitionend",measure);};
  },[cameraMode,selectedListing,profileVisible,floorPreview,introReady,size,gl]);

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
      const started = performance.now();
      const state = useWorldStore.getState();
      if (state.cameraMode === "overview" || state.cameraMode === "districtBuilding") return;
      event.stopImmediatePropagation();
      const action = state.focusedInputMode === "zoom" ? "zoom" : focusedWheelAction(event);
      beginFocusedWheel(action, intro.current, transition, manual);
      if (action === "zoom") {
        event.preventDefault();
        zoomBy(Math.max(-120,Math.min(120,event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?size.height:1))) * 0.0018);
        return;
      }
      event.preventDefault();
      const id = state.selectedTowerId ?? "companies";
      const input=wheelTravel.current;
      const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?size.height:1);
      const now=performance.now();
      if(now-input.time>180 || Math.sign(input.total)!==Math.sign(pixels))input.total=0;
      input.total+=pixels; input.time=now;
      if(Math.abs(input.total)>=60){pendingInput.current=now;travelFloors(listingsByTower[id],Math.sign(input.total));input.total=0;}
      recordNavigationSample("wheelHandlerMs", performance.now()-started);
      recordNavigationSample("wheelDeltaPixels", Math.abs(pixels));
    };
    element.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => element.removeEventListener("wheel", onWheel, true);
  }, [gl, listingsByTower, size.height, travelFloors, zoomBy]);

  const destination = useMemo(() => {
    const heightFor=(count:number)=>getTowerHeight(count,exploded);
    const floorFor=(rank:number,count:number)=>getFloorY(rank,count,exploded);
    const occupied=Object.entries(floorCounts).filter(([,count])=>count>0).map(([id,count])=>towerWorldBounds(id as TowerId,count,exploded));
    // Fit the marketplace, not every distant decoration or empty ground corner.
    const bounds=occupied.reduce((combined,box)=>combined.union(box),new Box3());
    const usableWidth=safeViewport.right-safeViewport.left;
    const usableHeight=safeViewport.bottom-safeViewport.top;
    const overview=fitRectangularBounds(bounds,new Vector3(0.13,0.30,1),size.width,size.height,usableWidth,usableHeight,42,occupied);
    // Projection offset reserves UI space without moving the orbit pivot away from the actual subject.
    let target=overview.center.clone();
    let offset=overview.forward.clone().multiplyScalar(overview.distance);

    const secondary=districtBuilding(selectedDistrictBuildingId);
    if(cameraMode==="districtBuilding"&&secondary){
      const center=new Vector3(secondary.position[0],secondary.geometry.height/2,secondary.position[2]);
      const extent=new Vector3(secondary.geometry.width/2+.4,secondary.geometry.height/2+.4,secondary.geometry.depth/2+.4);
      const fit=fitRectangularBounds(new Box3(center.clone().sub(extent),center.clone().add(extent)),new Vector3(.35,.35,1),size.width,size.height,usableWidth,usableHeight);
      target=fit.center;offset=fit.forward.multiplyScalar(fit.distance);
    } else if (cameraMode !== "overview") {
      const towerId = selectedListing?.towerId ?? selectedTowerId ??
        (cameraMode === "companiesTower" ? "companies" : cameraMode === "productsTower" ? "products" : "people");
      const tower = towerVisuals[towerId];
      const count = floorCounts[towerId];
      const rooftop=cameraMode==="rooftop";
      const localY = towerTravelY ?? (rooftop ? heightFor(count)+1.5 : cameraMode==="topFloor" ? floorFor(1,count) : floorPreview?.towerId===towerId ? floorFor(floorPreview.media.rank,count) : selectedListing ? floorFor(selectedListing.rank,count) : floorFor(1,count));
      const center=new Vector3(tower.position[0],towerCameraWorldY(towerId,localY),tower.position[2]);
      const extent=rooftop?new Vector3(4,2.3,3.4):new Vector3(3.5,0.85,2.3);
      const focusBounds=new Box3(center.clone().sub(extent),center.clone().add(extent));
      for(const rise of rooftop?[0.6]:[0.025,0.12,0.25,0.4,0.6,0.8]){
        const fit=fitRectangularBounds(focusBounds,new Vector3(rooftop?0.35:0.035,rise,1),size.width,size.height,usableWidth,usableHeight);
        target=fit.center.clone(); offset=fit.forward.clone().multiplyScalar(fit.distance);
        if(rooftop || !facadeOccluded(target.clone().add(offset),center.clone().add(new Vector3(0,0,RECTANGULAR_TOWER.facadeZ))))break;
      }
    }

    const angle = cameraOrbitStep * (Math.PI / 5);
    offset.applyAxisAngle(new Vector3(0, 1, 0), angle).multiplyScalar(cameraDistance);
    if(cameraMode!=="overview"&&cameraMode!=="rooftop"&&cameraMode!=="districtBuilding"){
      const id=selectedListing?.towerId??selectedTowerId??"companies";
      offset=safeInspectionOffset(target,offset,id,floorFor(selectedListing?.rank??floorPreview?.media.rank??1,floorCounts[id]),floorCounts,exploded);
    }

    return { position: target.clone().add(offset), target };
  }, [cameraDistance, cameraMode, cameraOrbitStep, floorCounts, floorPreview, selectedListing, selectedTowerId, selectedDistrictBuildingId,towerTravelY,size,safeViewport,exploded]);

  // A changed usable rectangle requires a fresh fit, not the previous viewport's
  // distance. Otherwise opening a drawer or resizing can clip a rotated facade.
  const anchor = `${cameraMode}|${selectedTowerId}|${selectedDistrictBuildingId}|${floorPreview?.media.id ?? ""}|${cameraResetVersion}|${size.width},${size.height}|${safeViewport.left},${safeViewport.right},${safeViewport.top},${safeViewport.bottom}`;
  useEffect(() => {
    const prior = previousDestination.current;
    const anchorChanged = previousAnchor.current !== anchor;
    if (prior && (cameraDistance !== previousDistance.current || cameraOrbitStep !== previousOrbitStep.current)) {
      // Toolbar actions have the same authority as pointer and wheel input.
      // Accumulate them from the previous destination, not a half-finished frame.
      intro.current.interrupted = true;
    }
    if (anchorChanged) {
      manual.current = false;
      transition.current = 1;
    } else if (prior && controls.current) {
      // Travel and toolbar zoom/rotate operate on the user's current orbit, not a stale scripted view.
      const control = controls.current;
      const offset = manual.current ? camera.position.clone().sub(control.target) : prior.position.clone().sub(prior.target);
      offset.multiplyScalar(cameraDistance / previousDistance.current);
      offset.applyAxisAngle(new Vector3(0, 1, 0), (cameraOrbitStep - previousOrbitStep.current) * Math.PI / 5);
      const nextTarget=destination.target.clone();
      const id=selectedListing?.towerId??selectedTowerId??"companies";
      const safeOffset=cameraMode!=="overview"&&cameraMode!=="rooftop"&&cameraMode!=="districtBuilding"?safeInspectionOffset(nextTarget,offset,id,getFloorY(selectedListing?.rank??floorPreview?.media.rank??1,floorCounts[id],exploded),floorCounts,exploded):offset;
      destination.position.copy(nextTarget.clone().add(safeOffset)); destination.target.copy(nextTarget);
      manual.current=false;
      transition.current = 1;
    } else {
      transition.current = 1;
    }
    previousDestination.current = destination;
    previousAnchor.current = anchor;
    previousDistance.current = cameraDistance;
    previousOrbitStep.current = cameraOrbitStep;
  }, [anchor, camera, cameraDistance, cameraOrbitStep, destination, selectedListing, selectedTowerId, floorCounts, exploded, floorPreview, cameraMode, size, safeViewport]);

  useFrame(({gl:renderer,camera:frameCamera}, delta) => {
    if(pendingInput.current!==null && !manual.current && transition.current>0.001){recordNavigationSample("inputToCameraFrameMs",performance.now()-pendingInput.current);pendingInput.current=null;}
    const far=Math.max(300,(getTowerHeight(Math.max(...Object.values(floorCounts)),exploded)+getCrownHeight(floorCounts.companies))*6);
    if(frameCamera.far!==far){frameCamera.far=far;frameCamera.updateProjectionMatrix();}
    diagnosticsElapsed.current+=delta;
    collisionElapsed.current+=delta;
    if(manual.current&&cameraMode!=="overview"&&cameraMode!=="rooftop"&&cameraMode!=="districtBuilding"&&controls.current&&collisionElapsed.current>0.12){
      collisionElapsed.current=0;
      const id=selectedListing?.towerId??selectedTowerId??"companies";
      const y=getFloorY(selectedListing?.rank??floorPreview?.media.rank??1,floorCounts[id],exploded);
      if(inspectionBlocked(camera.position,id,y,floorCounts,exploded)){
        const target=controls.current.target,offset=camera.position.clone().sub(target);
        const safe=safeInspectionOffset(target,offset,id,y,floorCounts,exploded);
        const inside=(Object.keys(floorCounts) as TowerId[]).some(other=>other!==id&&towerWorldBounds(other,floorCounts[other],exploded).expandByScalar(0.2).containsPoint(camera.position));
        camera.position.lerp(target.clone().add(safe),inside||reducedMotion?1:0.5);
        controls.current.update();
      }
    }
    if((process.env.NODE_ENV==="development"||new URLSearchParams(window.location.search).get("diagnostics")==="1")&&diagnosticsElapsed.current>1){
      diagnosticsElapsed.current=0;
      const towerId=selectedListing?.towerId??selectedTowerId??"companies";
      const visual=towerVisuals[towerId];
      const inspectionRank=selectedListing?.rank??floorPreview?.media.rank??1;
      const floorY=getFloorY(inspectionRank,floorCounts[towerId],exploded);
      const project=(x:number)=>new Vector3(visual.position[0]+x,floorY,visual.position[2]+RECTANGULAR_TOWER.facadeZ).project(camera);
      const left=project(-RECTANGULAR_TOWER.clearWidth/2),right=project(RECTANGULAR_TOWER.clearWidth/2);
      const width=Math.abs(right.x-left.x)*size.width/2;
      const context=document.createElement("canvas").getContext("2d");
      const content=selectedListing??floorPreview?.media;
      const layout=content&&context?rectangularTextLayout(context,content):null;
      const projection={facadeWidth:width,logo:width*RECTANGULAR_AD.logo.size/RECTANGULAR_AD.width,name:width*(layout?.name.lines[0].size??RECTANGULAR_AD.nameSize)/RECTANGULAR_AD.width,subtitle:width*(layout?.subtitle[0]?.size??RECTANGULAR_AD.subtitleSize)/RECTANGULAR_AD.width,rank:width*(layout?.rank.size??RECTANGULAR_AD.statsSize)/RECTANGULAR_AD.width,amount:width*(layout?.amount.size??RECTANGULAR_AD.statsSize)/RECTANGULAR_AD.width};
      const face=facingAdvertisement(towerId,camera.position);
      const samples=advertisementSamples(towerId,floorY,face).map(sample=>sample.project(camera));
      const projectedWidth=(Math.max(...samples.map(sample=>sample.x))-Math.min(...samples.map(sample=>sample.x)))*size.width/2;
      const side=face==="identity"||face==="ranking";
      const sideLayout=content&&context&&side?sideTextLayout(context,content,face):null;
      const visibleProjection=side?{facadeWidth:projectedWidth,logo:projectedWidth*SIDE_AD.logo.size/SIDE_AD.width,name:face==="identity"?projectedWidth*(sideLayout?.name?.lines[0].size??68)/SIDE_AD.width:null,subtitle:face==="identity"?projectedWidth*(sideLayout?.tagline?.size??34)/SIDE_AD.width:null,rank:face==="ranking"?projectedWidth*(sideLayout?.rank.size??88)/SIDE_AD.width:null,amount:face==="ranking"?projectedWidth*(sideLayout?.amount.size??88)/SIDE_AD.width:null}:projection;
      const actualProjection=side?visibleProjection:Object.fromEntries(Object.entries(projection).map(([key,value])=>[key,value*projectedWidth/Math.max(0.001,width)]));
      const point=samples[7];
      renderer.domElement.dataset.ottCamera=JSON.stringify({cameraMode,districtBuildingId:selectedDistrictBuildingId,towerId,face,listingId:selectedListing?.id??null,rank:inspectionRank,preview:!!floorPreview,exploded,time:useWorldStore.getState().worldTime,safeViewport,size,position:camera.position.toArray(),target:controls.current?.target.toArray(),destination:destination.target.toArray(),floorCenter:[(point.x+1)*size.width/2,(1-point.y)*size.height/2],projection:actualProjection,blocked:cameraMode==="districtBuilding"?null:inspectionBlocked(camera.position,towerId,floorY,floorCounts,exploded)});
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
      minPolarAngle={cameraMode === "overview" || cameraMode === "rooftop" ? 0 : Math.PI / 4}
      target={[0, 4.4, 0]}
    />
  );
}
