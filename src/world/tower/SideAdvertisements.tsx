import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { worldMaterials } from "@/world/materials/world-materials";
import { getHiringSignMaterial, type FloorMediaContent } from "./floor-signs";
import { createSideTexture, SIDE_AD, SIDE_FACES } from "./side-signs";

/** Same two-wire slate language as the approved front, reserved on identity side only. */
function SideHiringSlate() {
  const pivot = useRef<Group>(null), reduced = useReducedMotion();
  const material = useMemo(() => getHiringSignMaterial(), []);
  useFrame(({ clock }) => { if (pivot.current) pivot.current.rotation.z = reduced ? 0 : Math.sin(clock.elapsedTime * 0.75) * 0.012; });
  return <group position={[1.22, 0.52, 0.16]}>
    <mesh position={[0, 0, -0.06]} material={worldMaterials.frame}><boxGeometry args={[0.936, 0.045, 0.2]} /></mesh>
    <group ref={pivot}>
      {[-1, 1].map(side => <mesh key={side} position={[side * 1.04 * 0.36, -0.305, 0]} material={worldMaterials.podium}><cylinderGeometry args={[0.008, 0.008, 0.61, 5]} /></mesh>)}
      <mesh position={[0, -0.75, 0]} material={material} castShadow><boxGeometry args={[1.04, 0.28, 0.045]} /></mesh>
      {[0, Math.PI].map(angle => <mesh key={angle} rotation={[0, angle, 0]} position={[0, -0.75, angle === 0 ? 0.023 : -0.023]}><planeGeometry args={[1.04, 0.28]} /><meshBasicMaterial map={material.map} toneMapped={false} /></mesh>)}
    </group>
  </group>;
}

export function SideAdvertisements({ listing, detailed }: { listing: FloorMediaContent; detailed: boolean }) {
  const media = useMemo(() => SIDE_FACES.map(face => createSideTexture(listing, face.role, detailed)), [listing, detailed]);
  useEffect(() => { media.forEach(texture => { texture.userData.active = true; texture.needsUpdate = true; }); return () => media.forEach(texture => texture.dispose()); }, [media]);
  // Selection bubbles to the canonical floor group; all faces use that exact listing.
  return <>{SIDE_FACES.map((face, index) => <group key={face.role} position={[face.x, 0, 0]} rotation={[0, face.angle, 0]}>
    <mesh><planeGeometry args={[SIDE_AD.worldWidth, SIDE_AD.worldHeight]} /><meshBasicMaterial map={media[index]} transparent depthWrite={false} toneMapped={false} /></mesh>
    {detailed && face.role === "identity" && listing.hiring ? <SideHiringSlate /> : null}
  </group>)}</>;
}
