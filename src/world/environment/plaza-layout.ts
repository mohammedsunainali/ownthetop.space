import { districtLayout, districtTowers } from "./district-layout";
type Point = readonly [number, number];
const [, , parkZ] = districtLayout.park.center;
export const plazaSeats = [-1, 1].flatMap((side) => [
  { x: side * 5.1, z: parkZ - 1.4, rotation: side * Math.PI / 2 },
  { x: side * 5.1, z: parkZ + 1.4, rotation: side * Math.PI / 2 },
]);
export const plazaBeds = [-1, 1].map((side) => ({ x: side * 3.9, z: parkZ + 2.9 }));
export const plazaPaths: { from: Point; to: Point; width: number }[] = [
  { from: [0, parkZ - 2.2], to: [districtTowers.companies.position[0], districtTowers.companies.position[2] + 3.7], width: 1.15 },
  ...(["products", "people"] as const).map((tower) => {
    const [x, , z] = districtTowers[tower].position;
    const side = Math.sign(x);
    return { from: [side * 4.7, parkZ + 2.4] as Point, to: [x - side * 4.1, z] as Point, width: 1.15 };
  }),
];
export function pathTransform(from: Point, to: Point) {
  const dx = to[0] - from[0], dz = to[1] - from[1];
  return { x: (from[0] + to[0]) / 2, z: (from[1] + to[1]) / 2, length: Math.hypot(dx, dz), rotation: Math.atan2(dx, dz) };
}
