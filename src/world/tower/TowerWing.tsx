import { worldMaterials } from "@/world/materials/world-materials";

interface TowerWingProps { angle: number; height: number; floorCount: number }

export function TowerWing({ angle, height, floorCount }: TowerWingProps) {
  const bands = [
    { start: 0, end: 0.38, reach: 2.08 },
    { start: 0.38, end: 0.72, reach: 1.56 },
    { start: 0.72, end: 1, reach: 1.08 },
  ];
  return (
    <group rotation={[0, angle, 0]}>
      {bands.map((band) => {
        const bandHeight = Math.max(0.18, (band.end - band.start) * (height - 0.7));
        return <mesh key={band.start} position={[0, 0.7 + (band.start + band.end) * (height - 0.7) / 2, band.reach / 2]} material={worldMaterials.frame} castShadow receiveShadow>
          <boxGeometry args={[0.55, bandHeight, band.reach]} />
        </mesh>;
      })}
      {floorCount > 0 ? <mesh position={[0, 0.83, 2.18]} material={worldMaterials.crown}><boxGeometry args={[0.62, 0.2, 0.24]} /></mesh> : null}
    </group>
  );
}
