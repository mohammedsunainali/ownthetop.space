import { worldMaterials } from "@/world/materials/world-materials";
import { neighborhoodRoads } from "./neighborhood-layout";
/** Streets and sidewalk margins share the same canonical block dimensions. */
export function DistrictStreets() {
  return <group>
    {neighborhoodRoads.map((road, index) => <group key={index} position={[road.x, 0, road.z]}>
      <mesh material={worldMaterials.podium} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}><planeGeometry args={[road.width + 0.8, road.depth + 0.8]} /></mesh>
      <mesh material={worldMaterials.road} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}><planeGeometry args={[road.width, road.depth]} /></mesh>
    </group>)}
    {[-34, 34].flatMap(x => [-28, 28].map(z => <group key={`${x}/${z}`} position={[x, -0.014, z]}>
      {[-1, 1].flatMap(side => [-0.45, -0.15, 0.15, 0.45].map(stripe => <mesh key={`${side}/${stripe}`} material={worldMaterials.facade} rotation={[-Math.PI / 2, 0, 0]} position={[stripe, 0, side * 1.28]}><planeGeometry args={[0.15, 0.5]} /></mesh>))}
    </group>))}
  </group>;
}
