import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ComponentRef } from "react";
import { TOUCH, Vector3 } from "three";
import type { Listing } from "@/domain/listing";
import type { TowerId } from "@/domain/tower";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useWorldQuality } from "@/hooks/use-world-quality";
import { useWorldStore } from "@/state/world-store";
import { getCrownHeight, getFloorY, getTowerHeight, towerVisuals } from "@/world/tower/tower-layout";

export function clampTowerTravel(y: number, floorCount: number): number {
  return Math.max(1.1, Math.min(getTowerHeight(floorCount) + getCrownHeight(floorCount) - 0.7, y));
}
export function shouldRunIntro(reducedMotion: boolean): boolean { return !reducedMotion; }
export function focusedWheelAction(event: Pick<WheelEvent, "ctrlKey" | "metaKey">): "zoom" | "travel" {
  return event.ctrlKey || event.metaKey ? "zoom" : "travel";
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
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const selectedTowerId = useWorldStore((state) => state.selectedTowerId);
  const cameraDistance = useWorldStore((state) => state.cameraDistance);
  const cameraOrbitStep = useWorldStore((state) => state.cameraOrbitStep);
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
      const start = state.cameraMode === "rooftop" ? getTowerHeight(count) + 2 : state.selectedListingId && selectedListing ? getFloorY(selectedListing.rank, count) + 0.2 : getFloorY(1, count);
      travelTowerBy(-event.deltaY * 0.007, 1.1, getTowerHeight(count) + getCrownHeight(count) - 0.7, start);
    };
    element.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => element.removeEventListener("wheel", onWheel, true);
  }, [floorCounts, gl, selectedListing, travelTowerBy, zoomBy]);

  const destination = useMemo(() => {
    const tallestHeight = getTowerHeight(Math.max(...Object.values(floorCounts)));
    const tallFixture = tallestHeight > getTowerHeight(40);
    const overviewScale = Math.max(0.82, tallestHeight / getTowerHeight(50));
    let target = new Vector3(0, tallestHeight * (tallFixture ? 0.5 : mobile ? 0.47 : 0.65), 0);
    let offset = new Vector3(mobile ? 10 : 22, mobile ? 25 : 46, mobile ? 56 : 84).multiplyScalar(overviewScale);

    if (cameraMode !== "overview") {
      const towerId = selectedListing?.towerId ?? selectedTowerId ??
        (cameraMode === "companiesTower" ? "companies" : cameraMode === "productsTower" ? "products" : "people");
      const tower = towerVisuals[towerId];
      const count = floorCounts[towerId];
      const y = towerTravelY ?? (cameraMode === "rooftop" ? getTowerHeight(count) + 4.1 : cameraMode === "topFloor" ? getFloorY(1, count) + 0.6 : floorPreview?.towerId === towerId ? getFloorY(floorPreview.media.rank, count) + 0.2 : selectedListing ? getFloorY(selectedListing.rank, count) + 0.2 : getTowerHeight(count) * 0.72);
      target = new Vector3(tower.position[0] + (selectedListing && !mobile ? 0.35 : 0), y, tower.position[2]);
      offset = cameraMode === "rooftop" ? new Vector3(mobile ? 9 : 5.6, 1.5, mobile ? 11 : 7.5) : cameraMode === "topFloor" ? new Vector3(mobile ? 8 : 5.4, 1, mobile ? 10 : 7.2) : selectedListing || floorPreview ? new Vector3(mobile ? 3.3 : 4.2, 0.8, mobile ? 12.8 : 3.0) : new Vector3(mobile ? 10 : 7.8, 1.3, mobile ? 13 : 9.8);
    }

    const angle = cameraOrbitStep * (Math.PI / 5);
    offset.applyAxisAngle(new Vector3(0, 1, 0), angle).multiplyScalar(cameraDistance);

    return { position: target.clone().add(offset), target };
  }, [cameraDistance, cameraMode, cameraOrbitStep, floorCounts, floorPreview, mobile, selectedListing, selectedTowerId, towerTravelY]);

  const anchor = `${cameraMode}|${selectedTowerId}|${selectedListing?.id ?? ""}|${floorPreview?.media.id ?? ""}`;
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
      camera.position.copy(control.target).add(offset);
      control.update();
      transition.current = 0;
    } else {
      transition.current = 1;
    }
    previousDestination.current = destination;
    previousAnchor.current = anchor;
    previousDistance.current = cameraDistance;
    previousOrbitStep.current = cameraOrbitStep;
  }, [anchor, camera, cameraDistance, cameraOrbitStep, destination]);

  useFrame((_, delta) => {
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

  return (
    <OrbitControls
      ref={controls}
      onStart={cancelScriptedMotion}
      makeDefault
      enableDamping={!reducedMotion}
      dampingFactor={0.08}
      minDistance={4}
      maxDistance={240}
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
