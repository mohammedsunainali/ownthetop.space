import { Html } from "@react-three/drei";
import { worldMaterials } from "@/world/materials/world-materials";
import { getArchitecturalHeightFeet, getTowerHeight } from "@/world/tower/tower-layout";

export function HeightRuler({ floorCount }: { floorCount: number }) {
  const height = getTowerHeight(floorCount) + 3;
  const architecturalFeet = getArchitecturalHeightFeet(floorCount);
  return <group position={[3.7, 0, 0]}>
    <mesh material={worldMaterials.summit} position={[0, height / 2, 0]}><cylinderGeometry args={[0.018, 0.018, height, 6]} /></mesh>
    {[0, 0.25, 0.5, 0.75, 1].map((fraction) => <group key={fraction} position={[0, height * fraction, 0]}>
      <mesh material={worldMaterials.frame} position={[0.15, 0, 0]}><boxGeometry args={[0.3, 0.025, 0.025]} /></mesh>
      {fraction > 0 && <Html position={[0.52, 0, 0]} distanceFactor={9} className="height-label height-label--minor" style={{ pointerEvents: "none" }}>{Math.round(architecturalFeet * fraction)} FT</Html>}
    </group>)}
  </group>;
}
