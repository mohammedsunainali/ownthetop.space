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
  rectangularGlass: new MeshStandardMaterial({color:"#205678",metalness:0.28,roughness:0.38,emissive:"#174f79",emissiveIntensity:0.07}),
  windowLight: new MeshStandardMaterial({color:"#6d9aac",emissive:"#f5db9e",emissiveIntensity:0.03,roughness:0.3}),
  podium: new MeshStandardMaterial({ color: tokens.material3d.body.color, roughness: tokens.material3d.body.roughness }),
  frame: new MeshStandardMaterial({ color: brand.navy, metalness: 0.55, roughness: 0.3 }),
  facade: new MeshStandardMaterial({ color: brand.white, metalness: 0.22, roughness: 0.4 }),
  glazing: new MeshStandardMaterial({ color: brand.white, metalness: 0.62, roughness: 0.15, emissive: brand.blue, emissiveIntensity: 0.03 }),
  sideGlazing: new MeshStandardMaterial({ color: brand.blue, metalness: 0.58, roughness: 0.16, emissive: brand.blue, emissiveIntensity: 0.04 }),
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
  worldMaterials.rectangularGlass.emissiveIntensity=time==="night"?0.24:time==="sunset"?0.12:0.07;
  worldMaterials.windowLight.emissiveIntensity=time==="night"?0.9:time==="sunset"?0.3:0.03;
  for (const material of Object.values(worldMaterials.floor)) {
    material.emissive.set(brand.blue);
    material.emissiveIntensity = time === "night" ? 0.18 : time === "sunset" ? 0.045 : 0;
    material.needsUpdate = true;
  }
  worldMaterials.sign.emissiveIntensity = time === "night" ? 0.62 : time === "sunset" ? 0.2 : 0.08;
  worldMaterials.glazing.emissiveIntensity = time === "night" ? 0.25 : time === "sunset" ? 0.08 : 0.03;
  worldMaterials.sideGlazing.emissiveIntensity = time === "night" ? 0.3 : time === "sunset" ? 0.09 : 0.04;
  worldMaterials.aircraftLight.emissiveIntensity = time === "night" ? 1.2 : 0;
}
