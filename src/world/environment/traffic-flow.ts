/** Small deterministic ring-road simulation; no physics, React updates or per-step allocations. */
export const trafficCrossings = [0, 0.5] as const;
export type TrafficLight = "green" | "amber" | "red";
export function trafficLight(time: number, crossing: number): TrafficLight {
  const phase = ((time + crossing * 10) % 20 + 20) % 20;
  return phase < 13 ? "green" : phase < 15 ? "amber" : "red";
}
export interface TrafficVehicle { phase: number; speed: number; desiredSpeed: number; direction: number; length: number }
export const vehicleArchetypes = [
  { kind: "bus", width: .4, height: .30, length: 1.3, cabin: [.36,.16,1.12] as const, cabinZ: 0 },
  { kind: "delivery-truck", width: .39, height: .29, length: 1, cabin: [.32,.16,.32] as const, cabinZ: .3 },
  { kind: "car", width: .34, height: .18, length: .68, cabin: [.27,.13,.34] as const, cabinZ: 0 },
  { kind: "compact", width: .30, height: .16, length: .58, cabin: [.25,.13,.30] as const, cabinZ: 0 },
  { kind: "van", width: .35, height: .23, length: .85, cabin: [.30,.15,.62] as const, cabinZ: .06 },
  { kind: "scooter", width: .12, height: .14, length: .48, cabin: [.10,.07,.20] as const, cabinZ: -.04 },
] as const;
const wrap = (value: number) => (value % 1 + 1) % 1;
export function createTraffic(count: number): TrafficVehicle[] {
  return Array.from({ length: count }, (_, i) => ({ phase: i / count, speed: 0.0065, desiredSpeed: 0.0065 + i % 3 * 0.0007, direction: i % 2 ? -1 : 1, length: vehicleArchetypes[i % vehicleArchetypes.length].length }));
}
export function stepTraffic(vehicles: TrafficVehicle[], delta: number, time: number): void {
  const dt = Math.min(Math.max(delta, 0), 0.05);
  for (const car of vehicles) {
    let clearance = 1;
    for (const other of vehicles) if (other !== car && other.direction === car.direction) {
      const gap = wrap((other.phase - car.phase) * car.direction);
      clearance = Math.min(clearance, Math.max(0, gap - (car.length + other.length) / 300 - 0.006));
    }
    for (let i = 0; i < trafficCrossings.length; i++) if (trafficLight(time, i) !== "green") {
      // Stop before the zebra crossing in either direction; never teleport at a phase wrap.
      const stop = wrap(trafficCrossings[i] - car.direction * 0.015);
      const gap = wrap((stop - car.phase) * car.direction);
      if (gap < 0.12) clearance = Math.min(clearance, gap);
    }
    const desired = Math.min(car.desiredSpeed, clearance * 0.8);
    car.speed += Math.max(-0.022 * dt, Math.min(0.009 * dt, desired - car.speed));
    if (clearance < 0.0005) car.speed = 0;
    const travel = Math.min(Math.max(0, car.speed) * dt, clearance);
    car.phase = wrap(car.phase + car.direction * travel);
  }
}
/** Models point forward along local +Z (body depth and headlamps), not local +X. */
export function vehicleHeading(xRadius: number, zRadius: number, phase: number, direction: number): number {
  const angle = phase * Math.PI * 2;
  return Math.atan2(-xRadius * Math.sin(angle) * direction, zRadius * Math.cos(angle) * direction);
}
/** Wait through green/amber and the clearance interval; cross only during red. */
export function crossingPerson(time: number, crossing: number): { x: number; z: number; rotation: number; walking: boolean } {
  const local = time + crossing * 10, cycle = Math.floor(local / 20);
  const phase = (local % 20 + 20) % 20;
  const progress = Math.min(1, Math.max(0, (phase - 15.8) / 3.5));
  const outward = cycle % 2 === 0, side = crossing === 0 ? 1 : -1;
  return { x: side * (24 + 5.7 * (outward ? progress : 1 - progress)), z: 0, rotation: side * (outward ? Math.PI / 2 : -Math.PI / 2), walking: progress > 0 && progress < 1 };
}
