import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ComponentRef } from "react";
import { Vector3 } from "three";
import type { Listing } from "@/domain/listing";
import { useWorldStore } from "@/state/world-store";
import { getFloorY, towerVisuals } from "@/world/tower/tower-layout";

interface CameraControllerProps {
  selectedListing: Listing | null;
  floorCount: number;
}

export function CameraController({ selectedListing, floorCount }: CameraControllerProps) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((state) => state.camera);
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const cameraDistance = useWorldStore((state) => state.cameraDistance);
  const cameraOrbitStep = useWorldStore((state) => state.cameraOrbitStep);
  const transition = useRef(1);

  const destination = useMemo(() => {
    let target = new Vector3(0, 4.4, 0);
    let offset = new Vector3(15, 8.5, 18);

    if (cameraMode !== "overview") {
      const towerId = selectedListing?.towerId ??
        (cameraMode === "companiesTower" ? "companies" : cameraMode === "productsTower" ? "products" : "people");
      const tower = towerVisuals[towerId];
      const y = selectedListing ? getFloorY(selectedListing.rank, floorCount) : 3.8;
      target = new Vector3(tower.position[0], y, tower.position[2]);
      offset = selectedListing ? new Vector3(5.8, 2.5, 7.2) : new Vector3(7.8, 4.6, 9.8);
    }

    const angle = cameraOrbitStep * (Math.PI / 5);
    offset.applyAxisAngle(new Vector3(0, 1, 0), angle).multiplyScalar(cameraDistance);

    return { position: target.clone().add(offset), target };
  }, [cameraDistance, cameraMode, cameraOrbitStep, floorCount, selectedListing]);

  useEffect(() => {
    transition.current = 1;
  }, [destination]);

  useFrame((_, delta) => {
    if (transition.current <= 0.001) return;

    const alpha = 1 - Math.exp(-delta * 5.5);
    camera.position.lerp(destination.position, alpha);
    controls.current?.target.lerp(destination.target, alpha);
    controls.current?.update();
    transition.current *= 1 - alpha;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={4}
      maxDistance={42}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, 4.4, 0]}
    />
  );
}
