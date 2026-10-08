import type { TowerId } from "@/domain/tower";
import type { TowerVisualConfig } from "@/world/types";
import { RECTANGULAR_TOWER as building } from "@/world/tower/rectangular-layout";

export const FLOOR_HEIGHT = building.floorHeight;
export const FLOOR_GAP = building.slabHeight;
export const FLOOR_PITCH = FLOOR_HEIGHT + FLOOR_GAP;
export const PODIUM_HEIGHT = building.podiumHeight;
export const FLOOR_BASE_Y = PODIUM_HEIGHT + FLOOR_GAP + FLOOR_HEIGHT / 2;
export const CROWN_UNSCALED_HEIGHT = building.roofHeight;
export const HELIPAD_LEVEL_OFFSET = 0.42;
/** Helicopter origin when landed; the visible pad surface sits 0.24 below it. */
export const HELIPAD_LOCAL_ANCHOR = [2.15, HELIPAD_LEVEL_OFFSET + 0.248, -1.75] as const;
export function getCrownVerticalScale(floorCount: number): number { void floorCount; return 1; }
export function getCrownHeight(floorCount: number): number { void floorCount; return CROWN_UNSCALED_HEIGHT; }
export function getHelipadWorldPosition(floorCount: number, exploded=false): [number, number, number] {
  const tower = towerVisuals.companies;
  return [
    tower.position[0] + HELIPAD_LOCAL_ANCHOR[0] * tower.scale,
    tower.position[1] + (getTowerHeight(floorCount,exploded) + HELIPAD_LOCAL_ANCHOR[1]) * tower.scale,
    tower.position[2] + HELIPAD_LOCAL_ANCHOR[2] * tower.scale,
  ];
}

export const towerVisuals: Record<TowerId, TowerVisualConfig> = {
  companies: { id: "companies", position: [0, 0, 0.4], accent: "blue", scale: 1 },
  products: { id: "products", position: [-8.8, 0, 0], accent: "lavender", scale: 1 },
  people: { id: "people", position: [8.8, 0, 0], accent: "teal", scale: 1 },
};

// Geometry scales from normalized floor position. Paid-floor count remains listings.length.
export function getFloorFootprint(rank: number, floorCount: number): number {
  void rank; void floorCount; return 1;
}

export function getFloorY(rank: number, floorCount: number, exploded=false): number {
  return FLOOR_BASE_Y + (floorCount - rank) * (FLOOR_PITCH+(exploded?0.12:0));
}
export function getNearestFloorRank(y: number, floorCount: number,exploded=false): number {
  return Math.max(1, Math.min(floorCount, floorCount - Math.round((y - FLOOR_BASE_Y) / (FLOOR_PITCH+(exploded?0.12:0)))));
}

export function getTowerHeight(floorCount: number, exploded=false): number {
  return PODIUM_HEIGHT + FLOOR_GAP + Math.max(0, floorCount) * FLOOR_PITCH + (exploded?Math.max(0,floorCount-1)*0.12:0);
}

/** Total architectural height through the spire tip; 30 feet per world unit. */
export function getArchitecturalHeightFeet(floorCount: number): number {
  return Math.round((getTowerHeight(floorCount) + getCrownHeight(floorCount)) * 30);
}
