import { MeshStandardMaterial } from "three";
import { worldMaterials } from "@/world/materials/world-materials";
import { districtLayout } from "./district-layout";
import { pathTransform, plazaBeds, plazaPaths, plazaSeats } from "./plaza-layout";
const lawn = new MeshStandardMaterial({ color: "#81b899", roughness: 0.95 });
const path = new MeshStandardMaterial({ color: "#d6d7cc", roughness: 0.9 });
const timber = new MeshStandardMaterial({ color: "#9d7964", roughness: 0.9 });
const bloom = new MeshStandardMaterial({ color: "#dcb7bb", roughness: 0.9 });
/** Low central garden furniture preserves bottom-floor advertising sightlines. */
export function CentralPlaza() {
  const [x, , z] = districtLayout.park.center;
  return <group>
    <mesh material={lawn} position={[x, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[districtLayout.park.x, districtLayout.park.z, 1]} receiveShadow><circleGeometry args={[1, 48]} /></mesh>
    <mesh material={path} position={[x, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[5.4, 3.4, 1]}><ringGeometry args={[0.87, 1, 48]} /></mesh>
    {plazaPaths.map(({ from, to, width }, i) => {
      const t = pathTransform(from, to);
      return <mesh key={i} material={path} position={[t.x, 0.011, t.z]} rotation={[-Math.PI / 2, 0, -t.rotation]}><planeGeometry args={[width, t.length]} /></mesh>;
    })}
    {plazaSeats.map((seat, i) => <group key={i} position={[seat.x, 0, seat.z]} rotation={[0, seat.rotation, 0]}>
      <mesh material={timber} position={[0, 0.27, 0]}><boxGeometry args={[1.15, 0.08, 0.38]} /></mesh>
      <mesh material={timber} position={[0, 0.43, -0.17]}><boxGeometry args={[1.15, 0.25, 0.06]} /></mesh>
      {[-0.42, 0.42].map((leg) => <mesh key={leg} material={worldMaterials.frame} position={[leg, 0.14, 0]}><boxGeometry args={[0.065, 0.28, 0.29]} /></mesh>)}
    </group>)}
    {plazaBeds.map((bed, i) => <group key={i} position={[bed.x, 0, bed.z]}>
      <mesh material={worldMaterials.podium} position={[0, 0.08, 0]}><boxGeometry args={[1.5, 0.16, 0.6]} /></mesh>
      <mesh material={worldMaterials.leaf} position={[0, 0.19, 0]}><boxGeometry args={[1.38, 0.13, 0.49]} /></mesh>
      {[-0.5, -0.25, 0, 0.25, 0.5].map((flower) => <mesh key={flower} material={bloom} position={[flower, 0.28, 0]}><icosahedronGeometry args={[0.085, 0]} /></mesh>)}
    </group>)}
  </group>;
}
