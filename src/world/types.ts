import type { TowerId } from "@/domain/tower";

export interface TowerVisualConfig {
  id: TowerId;
  position: [number, number, number];
  accent: "blue" | "lavender" | "teal";
  scale: number;
  rotation: number;
}
