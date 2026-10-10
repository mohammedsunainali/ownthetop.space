import { Box3, Vector3 } from "three";
import { districtLayout, outsideTowerApproaches } from "./district-layout";
/** Fixed seed: reloads preserve blocks and matched renderer measurements. */
export function districtRandom(seed: number): number {
  let value = seed ^ 0x4f5454;
  value = Math.imul(value ^ value >>> 16, 0x7feb352d);
  value = Math.imul(value ^ value >>> 15, 0x846ca68b);
  return ((value ^ value >>> 16) >>> 0) / 4294967296;
}
export const neighborhoodRoads = [
  { x: -34, z: 0, width: 1.7, depth: 104 }, { x: 34, z: 0, width: 1.7, depth: 104 },
  { x: 0, z: -28, width: 104, depth: 1.7 }, { x: 0, z: 28, width: 104, depth: 1.7 },
  { x: -30.5, z: 0, width: 7, depth: 1.7 }, { x: 30.5, z: 0, width: 7, depth: 1.7 },
  { x: 0, z: -25, width: 1.7, depth: 6 }, { x: 0, z: 25, width: 1.7, depth: 6 },
];
export const neighborhoodBuildings = [-48, -40, -28, -20, -12, 0, 12, 20, 28, 40, 48].flatMap((x, column) =>
  [-44, -36, -20, -12, 0, 12, 20, 36, 44].map((z, row) => {
    const seed = column * 41 + row * 7 + 19;
    const style = seed % 3;
    return { id:`district-${column}-${row}`, archetype:seed%8, x: x + (districtRandom(seed) - 0.5), z: z + (districtRandom(seed + 3) - 0.5),
      style, height: (style === 0 ? 1.5 : style === 1 ? 3 : 4.5) + districtRandom(seed + 9) * (style === 0 ? 2 : style === 1 ? 4 : 6), width: 2.2 + districtRandom(seed + 13) * 1.5, depth: 2.2 + districtRandom(seed + 17) * 1.5 };
  })).filter(item => (item.x / districtLayout.road.x) ** 2 + (item.z / districtLayout.road.z) ** 2 > 1.4 && outsideTowerApproaches(item, 2)).sort((a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z));
/** Same dimensions drive rendering and focused-ad sightline checks. */
export const neighborhoodBounds = neighborhoodBuildings.map(item => new Box3(
  new Vector3(item.x - item.width / 2 - 0.08, 0, item.z - item.depth / 2 - 0.08),
  new Vector3(item.x + item.width / 2 + 0.08, item.height + (item.style === 2 ? 0.35 : 0.13), item.z + item.depth / 2 + (item.style === 2 ? 0.08 : 0.33)),
));
