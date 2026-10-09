import { districtLayout, routeHeading, routePoint } from "./district-layout";
import { plazaSeats } from "./plaza-layout";
/** Decorative visitors, not analytics. Four walkers pause without teleporting; two seats. */
export function plazaPerson(time: number, index: number) {
  if (index >= 4) {
    const seat = plazaSeats[(index - 4) * 2];
    return { x: seat.x, z: seat.z, y: 0.49, rotation: seat.rotation, seated: true };
  }
  const walkingTime = Math.floor(time / 20) * 17 + Math.min(time % 20, 17);
  const phase = (index / 4 + walkingTime * (0.004 + index * 0.0003)) % 1;
  const [x, z] = routePoint(5.1, 3.05, phase);
  return { x: districtLayout.park.center[0] + x, z: districtLayout.park.center[2] + z, y: 0.18, rotation: routeHeading(5.1, 3.05, phase), seated: false };
}
