import type { TowerId } from "@/domain/tower";

/** Canonical world placement. Local floor/roof coordinates remain unchanged. */
export const districtTowers: Record<TowerId, { position: [number, number, number]; rotation: number }> = {
  companies: { position: [0, 0, -9], rotation: 0 },
  products: { position: [-13, 0, 8], rotation: 0 },
  people: { position: [13, 0, 8], rotation: 0 },
};

/** World-space route dimensions shared by the road/path meshes and moving life. */
export const districtLayout = {
  road: { x: 27, z: 22, width: 0.92 },
  walkway: { x: 24, z: 19, width: 0.48 },
  green: { x: 25, z: 20 },
  plaza: { x: 21, z: 15 },
  park: { center: [0, 0, 3] as const, x: 6, z: 4 },
  groundRadius: 36,
  hero: { x: 20, z: 15 },
} as const;

/** Reserve clear, low-level approaches on every elevation, not just the front. */
export function outsideTowerApproaches({ x, z }: { x: number; z: number }, margin = 0): boolean {
  return Object.values(districtTowers).every(({ position }) => {
    const dx = Math.abs(x - position[0]), dz = Math.abs(z - position[2]);
    return !(dx < 4.8 + margin && dz < 11 + margin || dx < 11 + margin && dz < 3.7 + margin);
  });
}

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
