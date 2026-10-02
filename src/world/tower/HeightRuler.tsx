import { Html } from "@react-three/drei";
import { worldMaterials } from "@/world/materials/world-materials";
import { getArchitecturalHeightFeet, getTowerHeight } from "@/world/tower/tower-layout";

export function HeightRuler({ floorCount }: { floorCount: number }) {
  const height = getTowerHeight(floorCount) + 3;
  return <group position={[3.7, 0, 0]}>
    <mesh material={worldMaterials.summit} position={[0, height / 2, 0]}><cylinderGeometry args={[0.018, 0.018, height, 6]} /></mesh>
    {[0, 0.25, 0.5, 0.75, 1].map((fraction) => <mesh key={fraction} material={worldMaterials.frame} position={[0.15, height * fraction, 0]}><boxGeometry args={[0.3, 0.025, 0.025]} /></mesh>)}
    <Html position={[0.55, height - 0.2, 0]} distanceFactor={8} className="height-label" style={{ pointerEvents: "none" }}>{getArchitecturalHeightFeet(floorCount)} FT TALL</Html>
  </group>;
}
