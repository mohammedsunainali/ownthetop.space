import { worldMaterials } from "@/world/materials/world-materials";

export function TowerCore({ height }: { height: number }) {
  return (
    <mesh position={[0, height / 2 + 0.38, 0]} material={worldMaterials.frame} castShadow receiveShadow>
      <cylinderGeometry args={[0.48, 0.83, height, 6]} />
    </mesh>
  );
}
