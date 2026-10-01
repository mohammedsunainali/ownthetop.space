import { worldMaterials } from "@/world/materials/world-materials";
import { TopPavilion } from "@/world/tower/TopPavilion";
import { TowerCore } from "@/world/tower/TowerCore";
import { TowerWing } from "@/world/tower/TowerWing";

interface TowerShellProps {
  height: number;
  floorCount: number;
  focused: boolean;
  onSelect: () => void;
}

export function TowerShell({ height, floorCount, focused, onSelect }: TowerShellProps) {
  return (
    <group>
      <mesh position={[0, 0.34, 0]} material={worldMaterials.podium} castShadow receiveShadow onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        <cylinderGeometry args={[2.55, 2.9, 0.68, 6]} />
      </mesh>
      <TowerCore height={height} />
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle) => <TowerWing key={angle} angle={angle} height={height} floorCount={floorCount} />)}
      <TopPavilion y={height + 0.18} floorCount={floorCount} focused={focused} />
    </group>
  );
}
