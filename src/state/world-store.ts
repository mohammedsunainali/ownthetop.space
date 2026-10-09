"use client";

import { create } from "zustand";
import type { Listing } from "@/domain/listing";
import type { TowerId } from "@/domain/tower";
import type { FloorMediaContent } from "@/world/tower/floor-signs";
import { districtBuilding } from "@/world/environment/district-inventory";

export type CameraMode = "overview" | "companiesTower" | "productsTower" | "peopleTower" | "selectedFloor" | "topFloor" | "rooftop" | "districtBuilding";
export type WorldTime = "day" | "sunset" | "night";
export type WorldTimeMode = "auto" | WorldTime;
export interface FloorPreview {
  towerId: TowerId;
  category: string;
  url: string;
  media: FloorMediaContent;
}
export function scheduledWorldTime(hour: number, minute = 0): WorldTime {
  const localMinutes = hour * 60 + minute;
  if (localMinutes >= 6 * 60 && localMinutes < 16 * 60) return "day";
  if (localMinutes >= 16 * 60 && localMinutes < 19 * 60) return "sunset";
  return "night";
}

interface WorldState {
  selectedDistrictBuildingId: string | null;
  districtPreviewName: string;
  previewDistrictBuilding: (name:string)=>void;
  selectDistrictBuilding: (id:string)=>void;
  selectedTowerId: TowerId | null;
  selectedListingId: string | null;
  profileVisible: boolean;
  focusedInputMode: "floors" | "zoom";
  toggleFocusedInputMode: () => void;
  closeProfile: () => void;
  cameraMode: CameraMode;
  soundEnabled: boolean;
  worldTime: WorldTimeMode;
  floorsExploded: boolean;
  rulerVisible: boolean;
  cameraDistance: number;
  cameraOrbitStep: number;
  cameraResetVersion: number;
  towerTravelY: number | null;
  hudRevealed: boolean;
  claimDraft: { url: string; towerId: TowerId; category: string; amountMinor: number; estimatedRank: number } | null;
  floorPreview: FloorPreview | null;
  openClaimDraft: (draft: NonNullable<WorldState["claimDraft"]>) => void;
  closeClaimDraft: () => void;
  showFloorPreview: (preview: FloorPreview) => void;
  clearFloorPreview: () => void;
  selectTower: (towerId: TowerId) => void;
  selectListing: (listingId: string, towerId: TowerId) => void;
  resetWorld: () => void;
  zoomBy: (delta: number) => void;
  rotateWorld: () => void;
  toggleSound: () => void;
  toggleWorldTime: () => void;
  setWorldTime: (time: WorldTimeMode) => void;
  toggleFloorsExploded: () => void;
  focusTop: () => void;
  focusRooftop: () => void;
  toggleRuler: () => void;
  travelTowerBy: (delta: number, min: number, max: number, start: number) => void;
  travelFloors: (listings: readonly Listing[], steps: number) => void;
  revealHud: () => void;
}

const cameraModeByTower: Record<TowerId, CameraMode> = {
  companies: "companiesTower",
  products: "productsTower",
  people: "peopleTower",
};

export const useWorldStore = create<WorldState>((set) => ({
  selectedDistrictBuildingId:null,
  districtPreviewName:"",
  previewDistrictBuilding:name=>set(state=>state.cameraMode==="districtBuilding"?{districtPreviewName:name.trim().replace(/\s+/g," ").slice(0,48)}:state),
  selectDistrictBuilding:id=>{const building=districtBuilding(id);if(building?.inventory.kind!=="preview")return;set({selectedDistrictBuildingId:id,districtPreviewName:"",selectedListingId:null,selectedTowerId:null,floorPreview:null,cameraMode:"districtBuilding",cameraDistance:1,cameraOrbitStep:0,towerTravelY:null,hudRevealed:false});},
  selectedTowerId: null,
  selectedListingId: null,
  profileVisible: true,
  focusedInputMode: "floors",
  toggleFocusedInputMode: () => set(state=>({focusedInputMode:state.focusedInputMode==="floors"?"zoom":"floors"})),
  closeProfile: () => set({profileVisible:false}),
  cameraMode: "overview",
  soundEnabled: false,
  worldTime: "day",
  floorsExploded: false,
  rulerVisible: false,
  cameraDistance: 1,
  cameraOrbitStep: 0,
  cameraResetVersion: 0,
  towerTravelY: null,
  hudRevealed: false,
  claimDraft: null,
  floorPreview: null,
  openClaimDraft: (claimDraft) => set({ claimDraft, floorPreview: null }),
  closeClaimDraft: () => set({ claimDraft: null }),
  showFloorPreview: (floorPreview) => set({ selectedDistrictBuildingId:null, floorPreview, claimDraft: null, selectedListingId: null, selectedTowerId: floorPreview.towerId, cameraMode: "selectedFloor", towerTravelY: null, hudRevealed: false }),
  clearFloorPreview: () => set({ floorPreview: null, selectedTowerId: null, selectedListingId: null, cameraMode: "overview", towerTravelY: null }),
  selectTower: (towerId) =>
    set({ selectedDistrictBuildingId:null, selectedTowerId: towerId, selectedListingId: null, floorPreview: null, cameraMode: cameraModeByTower[towerId], towerTravelY: null, hudRevealed: false }),
  selectListing: (listingId, towerId) =>
    set({ selectedDistrictBuildingId:null, selectedListingId: listingId, selectedTowerId: towerId, profileVisible:true, floorPreview: null, cameraMode: "selectedFloor", towerTravelY: null, hudRevealed: false }),
  resetWorld: () =>
    set((state) => ({
      selectedDistrictBuildingId:null,
      districtPreviewName:"",
      selectedTowerId: null,
      selectedListingId: null,
      cameraMode: "overview",
      focusedInputMode: "floors",
      cameraDistance: 1,
      cameraOrbitStep: 0,
      cameraResetVersion: state.cameraResetVersion + 1,
      floorsExploded: false,
      towerTravelY: null,
      hudRevealed: false,
      floorPreview: null,
      claimDraft: null,
    })),
  zoomBy: (delta) => set((state) => ({ cameraDistance: Math.min(state.cameraMode === "overview" ? 1.12 : 1.45, Math.max(state.cameraMode === "selectedFloor" ? 0.86 : 0.72, state.cameraDistance + delta)) })),
  rotateWorld: () => set((state) => ({ cameraOrbitStep: state.cameraOrbitStep + 1 })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  focusTop: () => set((state) => ({ selectedDistrictBuildingId:null, selectedTowerId: state.selectedTowerId ?? "companies", selectedListingId: null, cameraMode: "topFloor", towerTravelY: null, hudRevealed: false })),
  focusRooftop: () => set((state) => ({ selectedDistrictBuildingId:null, selectedTowerId: state.selectedTowerId ?? "companies", selectedListingId: null, cameraMode: "rooftop", towerTravelY: null, hudRevealed: false })),
  travelTowerBy: (delta, min, max, start) => set((state) => ({ towerTravelY: Math.max(min, Math.min(max, (state.towerTravelY ?? start) + delta)), hudRevealed: false })),
  travelFloors: (listings, steps) => set((state) => {
    if (!listings.length || !Number.isFinite(steps)) return state;
    const current = listings.find(item => item.id === state.selectedListingId);
    const rank = Math.max(1, Math.min(listings.length, (current?.rank ?? 1) + Math.trunc(steps)));
    const listing = listings.find(item => item.rank === rank);
    if (!listing) return state;
    return { selectedDistrictBuildingId:null, selectedListingId: listing.id, selectedTowerId: listing.towerId, profileVisible:true, cameraMode: "selectedFloor", floorPreview: null, towerTravelY: null, hudRevealed: false };
  }),
  revealHud: () => set({ hudRevealed: true }),
  toggleRuler: () => set((state) => ({ rulerVisible: !state.rulerVisible })),
  toggleWorldTime: () => set((state) => ({ worldTime: state.worldTime === "day" ? "sunset" : state.worldTime === "sunset" ? "night" : "day" })),
  setWorldTime: (worldTime) => set({ worldTime }),
  toggleFloorsExploded: () => set((state) => ({ floorsExploded: !state.floorsExploded })),
}));
