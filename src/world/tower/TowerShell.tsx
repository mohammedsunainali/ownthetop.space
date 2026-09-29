import { TowerCore } from "@/world/tower/TowerCore";
import { TowerWing } from "@/world/tower/TowerWing";

interface TowerShellProps {
  height: number;
  accent: string;
  glass: string;
  onSelect: () => void;
}

export function TowerShell({ height, accent, glass, onSelect }: TowerShellProps) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        <cylinderGeometry args={[2.45, 2.8, 0.7, 6]} />
        <meshStandardMaterial color="#dce9f6" roughness={0.72} />
      </mesh>
      <TowerCore height={height} glass={glass} />
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle) => (
        <TowerWing key={angle} angle={angle} height={height} color={glass} />
      ))}
      <mesh position={[0, height + 0.58, 0]} castShadow>
        <coneGeometry args={[0.78, 1.65, 6]} />
        <meshStandardMaterial color={accent} roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh position={[0, height + 2.15, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.1, 1.9, 8]} />
        <meshStandardMaterial color="#26364a" metalness={0.68} roughness={0.24} />
      </mesh>
    </group>
  );
}
