import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ComponentRef } from "react";
import { Vector3 } from "three";
import type { Listing } from "@/domain/listing";
import type { TowerId } from "@/domain/tower";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useWorldQuality } from "@/hooks/use-world-quality";
import { useWorldStore } from "@/state/world-store";
import { getFloorY, getTowerHeight, towerVisuals } from "@/world/tower/tower-layout";

interface CameraControllerProps {
  selectedListing: Listing | null;
  floorCounts: Record<TowerId, number>;
}

export function CameraController({ selectedListing, floorCounts }: CameraControllerProps) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((state) => state.camera);
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const cameraDistance = useWorldStore((state) => state.cameraDistance);
  const cameraOrbitStep = useWorldStore((state) => state.cameraOrbitStep);
  const reducedMotion = useReducedMotion();
  const mobile = useWorldQuality();
  const transition = useRef(1);

  const destination = useMemo(() => {
    const referenceHeight = getTowerHeight(20);
    const tallestHeight = getTowerHeight(Math.max(...Object.values(floorCounts)));
    let target = new Vector3(0, tallestHeight * 0.48, 0);
    let offset = new Vector3(mobile ? 19 : 15, mobile ? 11 : 8.5, mobile ? 22 : 18).multiplyScalar(Math.max(1, tallestHeight / referenceHeight));

    if (cameraMode !== "overview") {
      const towerId = selectedListing?.towerId ??
        (cameraMode === "companiesTower" ? "companies" : cameraMode === "productsTower" ? "products" : "people");
      const tower = towerVisuals[towerId];
      const count = floorCounts[towerId];
      const y = selectedListing ? getFloorY(selectedListing.rank, count) : getTowerHeight(count) * 0.55;
      target = new Vector3(tower.position[0], y, tower.position[2]);
      offset = selectedListing ? new Vector3(mobile ? 7.5 : 5.8, 2.5, mobile ? 9.2 : 7.2) : new Vector3(mobile ? 10 : 7.8, 4.6, mobile ? 13 : 9.8).multiplyScalar(Math.max(1, getTowerHeight(count) / referenceHeight));
    }

    const angle = cameraOrbitStep * (Math.PI / 5);
    offset.applyAxisAngle(new Vector3(0, 1, 0), angle).multiplyScalar(cameraDistance);

    return { position: target.clone().add(offset), target };
  }, [cameraDistance, cameraMode, cameraOrbitStep, floorCounts, mobile, selectedListing]);

  useEffect(() => {
    transition.current = 1;
  }, [destination]);

  useFrame((_, delta) => {
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
      maxDistance={42}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, 4.4, 0]}
    />
  );
}
