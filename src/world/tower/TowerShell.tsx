import { worldMaterials } from "@/world/materials/world-materials";
import { useTexture } from "@react-three/drei";
import { MascotSlot } from "@/world/mascot/MascotSlot";
import { TowerCore } from "@/world/tower/TowerCore";
import { TowerWing } from "@/world/tower/TowerWing";

interface TowerShellProps {
  height: number;
  floorCount: number;
  onSelect: () => void;
}

export function TowerShell({ height, floorCount, onSelect }: TowerShellProps) {
  const logoTexture = useTexture("/brand/ownthetop-logo-primary.svg");
  return (
    <group>
      <mesh position={[0, 0.34, 0]} material={worldMaterials.podium} castShadow receiveShadow onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        <cylinderGeometry args={[2.55, 2.9, 0.68, 6]} />
      </mesh>
      <TowerCore height={height} />
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle) => <TowerWing key={angle} angle={angle} height={height} floorCount={floorCount} />)}
      <mesh position={[0, height + 0.17, 0]} material={worldMaterials.frame} castShadow>
        <cylinderGeometry args={[0.72, 0.94, 0.34, 6]} />
      </mesh>
      <mesh position={[0, height + 0.36, 0]} material={worldMaterials.crown} castShadow>
        <cylinderGeometry args={[0.48, 0.7, 0.38, 6]} />
      </mesh>
      <mesh position={[0, height + 0.36, 0.69]} material={worldMaterials.podium}>
        <planeGeometry args={[0.96, 0.22]} />
      </mesh>
      <mesh position={[0, height + 0.36, 0.70]}>
        <planeGeometry args={[0.9, 0.19]} />
        <meshBasicMaterial map={logoTexture} transparent depthWrite={false} />
      </mesh>
      <mesh position={[0, height + 0.55, 0]} material={worldMaterials.podium}>
        <cylinderGeometry args={[0.42, 0.42, 0.025, 24]} />
      </mesh>
      <mesh position={[0, height + 0.58, 0]} material={worldMaterials.crown} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.31, 0.028, 5, 24]} />
      </mesh>
      <mesh position={[0, height + 1.42, 0]} material={worldMaterials.frame} castShadow>
        <cylinderGeometry args={[0.02, 0.1, 1.7, 8]} />
      </mesh>
      <MascotSlot position={[0, height + 0.58, 0]} />
    </group>
  );
}
