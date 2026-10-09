import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, MeshStandardMaterial, PlaneGeometry } from "three";
import { worldMaterials } from "@/world/materials/world-materials";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { swimmerPose } from "./rooftop-life";

export function RooftopPool() {
  const water = useRef<PlaneGeometry>(null), swimmer = useRef<Group>(null);
  const waterMaterial = useRef<MeshStandardMaterial>(null);
  const reduced = useReducedMotion();
  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime;
    if (waterMaterial.current) waterMaterial.current.emissiveIntensity = Math.max(0, worldMaterials.windowLight.emissiveIntensity - 0.03) * 0.3;
    const positions = water.current?.attributes.position;
    if (positions) {
      for (let i = 0; i < positions.count; i++) positions.setZ(i, reduced ? 0 : Math.sin(positions.getX(i) * 10 + t * 0.8) * Math.cos(positions.getY(i) * 12 + t * 0.7) * 0.004);
      positions.needsUpdate = true;
    }
    if (swimmer.current) {
      const pose = swimmerPose(t);
      swimmer.current.position.set(pose.x, 0.335, pose.z);
      swimmer.current.rotation.y = pose.rotation;
    }
  });
  return <>
    <mesh position={[1.4, 0.315, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry ref={water} args={[2.25, 1.45, 16, 8]} />
      <meshStandardMaterial ref={waterMaterial} color="#32b7d2" emissive="#168ca5" emissiveIntensity={0} metalness={0.22} roughness={0.18} transparent opacity={0.85} />
    </mesh>
    <group ref={swimmer} position={[1.4, 0.335, 1.8]}>
      <mesh><boxGeometry args={[0.13, 0.065, 0.3]} /><meshStandardMaterial color="#183857" /></mesh>
      <mesh position={[0, 0.025, 0.2]}><sphereGeometry args={[0.065, 8, 6]} /><meshStandardMaterial color="#bd8e69" /></mesh>
      {[-1, 1].map(side => <mesh key={side} position={[side * 0.1, 0.015, 0.06]} rotation={[0, side * 0.5, 0]}><boxGeometry args={[0.05, 0.04, 0.22]} /><meshStandardMaterial color="#bd8e69" /></mesh>)}
    </group>
  </>;
}
