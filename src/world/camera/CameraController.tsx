import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ComponentRef } from "react";
import { Vector3 } from "three";
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

interface CameraControllerProps {
  selectedListing: Listing | null;
  floorCounts: Record<TowerId, number>;
}

export function CameraController({ selectedListing, floorCounts }: CameraControllerProps) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((state) => state.camera);
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const selectedTowerId = useWorldStore((state) => state.selectedTowerId);
  const cameraDistance = useWorldStore((state) => state.cameraDistance);
  const cameraOrbitStep = useWorldStore((state) => state.cameraOrbitStep);
  const towerTravelY = useWorldStore((state) => state.towerTravelY);
  const travelTowerBy = useWorldStore((state) => state.travelTowerBy);
  const gl = useThree((state) => state.gl);
  const reducedMotion = useReducedMotion();
  const mobile = useWorldQuality();
  const transition = useRef(1);
  const intro = useRef({ elapsed: 0, interrupted: false });

  useEffect(() => {
    const interrupt = () => { intro.current.interrupted = true; transition.current = 1; };
    gl.domElement.addEventListener("pointerdown", interrupt);
    gl.domElement.addEventListener("wheel", interrupt);
    return () => { gl.domElement.removeEventListener("pointerdown", interrupt); gl.domElement.removeEventListener("wheel", interrupt); };
  }, [gl]);

  useEffect(() => {
    const element = gl.domElement;
    const onWheel = (event: WheelEvent) => {
      const state = useWorldStore.getState();
      if (state.cameraMode === "overview") return;
      event.preventDefault();
      const id = state.selectedTowerId ?? "companies";
      const count = floorCounts[id];
      const start = state.cameraMode === "rooftop" ? getTowerHeight(count) + 2 : state.selectedListingId && selectedListing ? getFloorY(selectedListing.rank, count) + 0.2 : getFloorY(1, count);
      travelTowerBy(-event.deltaY * 0.007, 1.1, getTowerHeight(count) + getCrownHeight(count) - 0.7, start);
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [floorCounts, gl, selectedListing, travelTowerBy]);

  const destination = useMemo(() => {
    const referenceHeight = getTowerHeight(20);
    const tallestHeight = getTowerHeight(Math.max(...Object.values(floorCounts)));
    const tallFixture = tallestHeight > getTowerHeight(40);
    let target = new Vector3(0, tallestHeight * (tallFixture ? 0.62 : mobile ? 1.42 : 1.5), 0);
    let offset = new Vector3(mobile ? 7 : 5, mobile ? 9 : 7, mobile ? 23 : 20).multiplyScalar(Math.max(1, tallestHeight / referenceHeight));

    if (cameraMode !== "overview") {
      const towerId = selectedListing?.towerId ?? selectedTowerId ??
        (cameraMode === "companiesTower" ? "companies" : cameraMode === "productsTower" ? "products" : "people");
      const tower = towerVisuals[towerId];
      const count = floorCounts[towerId];
      const y = towerTravelY ?? (cameraMode === "rooftop" ? getTowerHeight(count) + 2.2 : cameraMode === "topFloor" ? getFloorY(1, count) + 0.6 : selectedListing ? getFloorY(selectedListing.rank, count) + 0.2 : getTowerHeight(count) * 0.72);
      target = new Vector3(tower.position[0], y, tower.position[2]);
      offset = cameraMode === "rooftop" ? new Vector3(mobile ? 7 : 4, 1.8, mobile ? 8 : 5) : cameraMode === "topFloor" ? new Vector3(mobile ? 8 : 5.4, 1, mobile ? 10 : 7.2) : selectedListing ? new Vector3(mobile ? 7.5 : 5.8, 0.8, mobile ? 9.2 : 7.2) : new Vector3(mobile ? 10 : 7.8, 1.3, mobile ? 13 : 9.8);
    }

    const angle = cameraOrbitStep * (Math.PI / 5);
    offset.applyAxisAngle(new Vector3(0, 1, 0), angle).multiplyScalar(cameraDistance);

    return { position: target.clone().add(offset), target };
  }, [cameraDistance, cameraMode, cameraOrbitStep, floorCounts, mobile, selectedListing, selectedTowerId, towerTravelY]);

  useEffect(() => {
    transition.current = 1;
  }, [destination]);

  useFrame((_, delta) => {
    if (cameraMode !== "overview") intro.current.interrupted = true;
    if (shouldRunIntro(reducedMotion) && !intro.current.interrupted && intro.current.elapsed < 3.1) {
      intro.current.elapsed = Math.min(3.1, intro.current.elapsed + delta);
      const t = intro.current.elapsed / 3.1;
      const eased = t * t * (3 - 2 * t);
      const introTarget = destination.target.clone();
      introTarget.y = 2.5 + (destination.target.y - 2.5) * eased;
      camera.position.copy(introTarget.clone().add(destination.position.clone().sub(destination.target)));
      controls.current?.target.copy(introTarget);
      controls.current?.update();
      if (t === 1) transition.current = 0;
      return;
    }
    if (transition.current <= 0.001) return;

    const alpha = reducedMotion ? 1 : 1 - Math.exp(-delta * 5.5);
    camera.position.lerp(destination.position, alpha);
    controls.current?.target.lerp(destination.target, alpha);
    controls.current?.update();
    transition.current *= 1 - alpha;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping={!reducedMotion}
      dampingFactor={0.08}
      minDistance={4}
      maxDistance={240}
      enableZoom={cameraMode === "overview"}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, 4.4, 0]}
    />
  );
}
