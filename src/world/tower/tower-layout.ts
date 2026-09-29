import type { TowerId } from "@/domain/tower";
import type { TowerVisualConfig } from "@/world/types";

export const FLOOR_HEIGHT = 0.34;
export const FLOOR_GAP = 0.09;
export const FLOOR_PITCH = FLOOR_HEIGHT + FLOOR_GAP;
export const PODIUM_HEIGHT = 0.7;
export const FLOOR_BASE_Y = PODIUM_HEIGHT + FLOOR_HEIGHT / 2 + 0.16;

export const towerVisuals: Record<TowerId, TowerVisualConfig> = {
  companies: { id: "companies", position: [-6.2, 0, 0.4], accent: "#155eef", glass: "#8ec5ff", scale: 1 },
  products: { id: "products", position: [0, 0, -1.1], accent: "#6d4aff", glass: "#b9a7ff", scale: 0.96 },
  people: { id: "people", position: [6.2, 0, 0.6], accent: "#007f75", glass: "#8adbd3", scale: 0.92 },
};

export function getFloorY(rank: number, floorCount: number): number {
  return FLOOR_BASE_Y + (floorCount - rank) * FLOOR_PITCH;
}

export function getTowerHeight(floorCount: number): number {
  return FLOOR_BASE_Y + floorCount * FLOOR_PITCH;
}
