"use client";

import { create } from "zustand";
import type { TowerId } from "@/domain/tower";

export type CameraMode = "overview" | "companiesTower" | "productsTower" | "peopleTower" | "selectedFloor";

interface WorldState {
  selectedTowerId: TowerId | null;
  selectedListingId: string | null;
  cameraMode: CameraMode;
  soundEnabled: boolean;
  worldTime: "day" | "night";
  floorsExploded: boolean;
  cameraDistance: number;
  cameraOrbitStep: number;
  selectTower: (towerId: TowerId) => void;
  selectListing: (listingId: string, towerId: TowerId) => void;
  resetWorld: () => void;
  zoomBy: (delta: number) => void;
  rotateWorld: () => void;
  toggleSound: () => void;
  toggleWorldTime: () => void;
  toggleFloorsExploded: () => void;
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
  cameraDistance: 1,
  cameraOrbitStep: 0,
  selectTower: (towerId) =>
    set({ selectedTowerId: towerId, selectedListingId: null, cameraMode: cameraModeByTower[towerId] }),
  selectListing: (listingId, towerId) =>
    set({ selectedListingId: listingId, selectedTowerId: towerId, cameraMode: "selectedFloor" }),
  resetWorld: () =>
    set({
      selectedTowerId: null,
      selectedListingId: null,
      cameraMode: "overview",
      cameraDistance: 1,
      cameraOrbitStep: 0,
      floorsExploded: false,
    }),
  zoomBy: (delta) => set((state) => ({ cameraDistance: Math.min(1.45, Math.max(0.62, state.cameraDistance + delta)) })),
  rotateWorld: () => set((state) => ({ cameraOrbitStep: state.cameraOrbitStep + 1 })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleWorldTime: () => set((state) => ({ worldTime: state.worldTime === "day" ? "night" : "day" })),
  toggleFloorsExploded: () => set((state) => ({ floorsExploded: !state.floorsExploded })),
}));
