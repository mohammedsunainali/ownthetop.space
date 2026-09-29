import type { TowerId } from "@/domain/tower";

export interface TowerVisualConfig {
  id: TowerId;
  position: [number, number, number];
  accent: string;
  glass: string;
  scale: number;
}
