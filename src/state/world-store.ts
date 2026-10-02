"use client";

import { create } from "zustand";
import type { TowerId } from "@/domain/tower";

export type CameraMode = "overview" | "companiesTower" | "productsTower" | "peopleTower" | "selectedFloor" | "topFloor" | "rooftop";

interface WorldState {
  selectedTowerId: TowerId | null;
  selectedListingId: string | null;
  cameraMode: CameraMode;
  soundEnabled: boolean;
  worldTime: "day" | "sunset" | "night";
  floorsExploded: boolean;
  rulerVisible: boolean;
  cameraDistance: number;
  cameraOrbitStep: number;
  towerTravelY: number | null;
  hudRevealed: boolean;
  selectTower: (towerId: TowerId) => void;
  selectListing: (listingId: string, towerId: TowerId) => void;
  resetWorld: () => void;
  zoomBy: (delta: number) => void;
  rotateWorld: () => void;
  toggleSound: () => void;
  toggleWorldTime: () => void;
  setWorldTime: (time: WorldState["worldTime"]) => void;
  toggleFloorsExploded: () => void;
  focusTop: () => void;
  focusRooftop: () => void;
  toggleRuler: () => void;
  travelTowerBy: (delta: number, min: number, max: number, start: number) => void;
  revealHud: () => void;
}

const cameraModeByTower: Record<TowerId, CameraMode> = {
  companies: "companiesTower",
  products: "productsTower",
  people: "peopleTower",
};

export const useWorldStore = create<WorldState>((set) => ({
  selectedTowerId: null,
  selectedListingId: null,
  cameraMode: "overview",
  soundEnabled: false,
  worldTime: "day",
  floorsExploded: false,
  rulerVisible: false,
  cameraDistance: 1,
  cameraOrbitStep: 0,
  towerTravelY: null,
  hudRevealed: false,
  selectTower: (towerId) =>
    set({ selectedTowerId: towerId, selectedListingId: null, cameraMode: cameraModeByTower[towerId], towerTravelY: null, hudRevealed: false }),
  selectListing: (listingId, towerId) =>
    set({ selectedListingId: listingId, selectedTowerId: towerId, cameraMode: "selectedFloor", towerTravelY: null, hudRevealed: false }),
  resetWorld: () =>
    set({
      selectedTowerId: null,
      selectedListingId: null,
      cameraMode: "overview",
      cameraDistance: 1,
      cameraOrbitStep: 0,
      floorsExploded: false,
      towerTravelY: null,
      hudRevealed: false,
    }),
  zoomBy: (delta) => set((state) => ({ cameraDistance: Math.min(1.45, Math.max(0.62, state.cameraDistance + delta)) })),
  rotateWorld: () => set((state) => ({ cameraOrbitStep: state.cameraOrbitStep + 1 })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  focusTop: () => set((state) => ({ selectedTowerId: state.selectedTowerId ?? "companies", selectedListingId: null, cameraMode: "topFloor", towerTravelY: null, hudRevealed: false })),
  focusRooftop: () => set((state) => ({ selectedTowerId: state.selectedTowerId ?? "companies", selectedListingId: null, cameraMode: "rooftop", towerTravelY: null, hudRevealed: false })),
  travelTowerBy: (delta, min, max, start) => set((state) => ({ towerTravelY: Math.max(min, Math.min(max, (state.towerTravelY ?? start) + delta)), hudRevealed: false })),
  revealHud: () => set({ hudRevealed: true }),
  toggleRuler: () => set((state) => ({ rulerVisible: !state.rulerVisible })),
  toggleWorldTime: () => set((state) => ({ worldTime: state.worldTime === "day" ? "sunset" : state.worldTime === "sunset" ? "night" : "day" })),
  setWorldTime: (worldTime) => set({ worldTime }),
  toggleFloorsExploded: () => set((state) => ({ floorsExploded: !state.floorsExploded })),
}));
