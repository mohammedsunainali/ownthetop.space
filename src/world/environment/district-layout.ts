/** World-space route dimensions shared by the road/path meshes and moving life. */
export const districtLayout = {
  road: { x: 13.15, z: 8.65, width: 0.92 },
  walkway: { x: 10.75, z: 6.45, width: 0.48 },
  green: { x: 11.65, z: 7.25 },
  plaza: { x: 8.4, z: 4.45 },
} as const;

export function routePoint(xRadius: number, zRadius: number, phase: number): [number, number] {
  const angle = phase * Math.PI * 2;
  return [Math.cos(angle) * xRadius, Math.sin(angle) * zRadius];
}

export function routeHeading(xRadius: number, zRadius: number, phase: number, direction = 1): number {
  const angle = phase * Math.PI * 2;
  const dx = -xRadius * Math.sin(angle) * direction;
  const dz = zRadius * Math.cos(angle) * direction;
  return Math.atan2(-dz, dx);
}
