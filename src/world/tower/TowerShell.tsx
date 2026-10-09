import { worldMaterials } from "@/world/materials/world-materials";
import { RectangularRooftop } from "@/world/tower/RectangularRooftop";
import type { TowerId } from "@/domain/tower";
import { TowerEntrance } from "./TowerEntrance";

interface TowerShellProps {
  towerId: TowerId;
  height: number;
  floorCount: number;
  focused: boolean;
  onSelect: () => void;
  premium?: boolean;
}

export function TowerShell({ height, floorCount, towerId, onSelect, premium = false }: TowerShellProps) {
  return (
    <group>
      <mesh position={[0, 0.36, 0]} material={worldMaterials.podium} castShadow receiveShadow onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        <boxGeometry args={[7.2, 0.72, 4.8]} />
      </mesh>
      <mesh position={[0,0.795,0]} material={worldMaterials.facade}><boxGeometry args={[7.04,0.15,4.64]}/></mesh>
      <TowerEntrance towerId={towerId} onSelect={onSelect} />
      {[-1,1].map(side=><group key={side} position={[side*3.4,height/2,0]}>
        <mesh material={worldMaterials.rectangularGlass}><boxGeometry args={[0.055,height,4.4]}/></mesh>
        {[-1.9,-0.95,0,0.95,1.9].map(z=><mesh key={z} position={[side*0.025,0,z]} material={worldMaterials.facade}><boxGeometry args={[0.065,height,0.035]}/></mesh>)}
      </group>)}
      <RectangularRooftop y={height} premium={premium} towerId={towerId} floorCount={floorCount} />
    </group>
  );
}
