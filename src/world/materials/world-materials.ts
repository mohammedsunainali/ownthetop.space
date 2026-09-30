import { MeshStandardMaterial } from "three";
import { tokens } from "@/design/tokens";
import type { TowerVisualConfig } from "@/world/types";

const { brand, sky } = tokens.color;
const glassByAccent = {
  blue: brand.lightBlue,
  lavender: brand.lavender,
  teal: brand.teal,
} satisfies Record<TowerVisualConfig["accent"], string>;

export const worldMaterials = {
  podium: new MeshStandardMaterial({ color: tokens.material3d.body.color, roughness: tokens.material3d.body.roughness }),
  frame: new MeshStandardMaterial({ color: brand.navy, metalness: 0.55, roughness: 0.3 }),
  crown: new MeshStandardMaterial({ color: brand.blue, metalness: 0.55, roughness: 0.28 }),
  summit: new MeshStandardMaterial({ color: tokens.material3d.gold.color, metalness: 0.45, roughness: tokens.material3d.gold.roughness }),
  selected: new MeshStandardMaterial({ color: brand.white, emissive: brand.blue, emissiveIntensity: 0.36, metalness: 0.24, roughness: 0.28 }),
  selectedSummit: new MeshStandardMaterial({ color: brand.summitGold, emissive: brand.blue, emissiveIntensity: 0.28, metalness: 0.4, roughness: 0.32 }),
  floor: Object.fromEntries((Object.entries(glassByAccent) as [TowerVisualConfig["accent"], string][]).map(([key, color]) => [key, new MeshStandardMaterial({ color, metalness: 0.4, roughness: 0.22 })])) as Record<TowerVisualConfig["accent"], MeshStandardMaterial>,
  cloud: new MeshStandardMaterial({ color: sky.cloud, roughness: 0.95 }),
  road: new MeshStandardMaterial({ color: brand.navy, roughness: 0.92 }),
  leaf: new MeshStandardMaterial({ color: brand.teal, roughness: 0.9 }),
  sign: new MeshStandardMaterial({ color: brand.navy, emissive: brand.blue, emissiveIntensity: 0.08 }),
  aircraftLight: new MeshStandardMaterial({ color: brand.blue, emissive: brand.blue, emissiveIntensity: 0 }),
};

export function applyTimeToWorldMaterials(time: "day" | "sunset" | "night") {
  for (const material of Object.values(worldMaterials.floor)) {
    material.emissive.set(brand.blue);
    material.emissiveIntensity = time === "night" ? 0.18 : time === "sunset" ? 0.045 : 0;
    material.needsUpdate = true;
  }
  worldMaterials.sign.emissiveIntensity = time === "night" ? 0.62 : time === "sunset" ? 0.2 : 0.08;
  worldMaterials.aircraftLight.emissiveIntensity = time === "night" ? 1.2 : 0;
}
