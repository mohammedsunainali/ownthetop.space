import { beforeEach, describe, expect, it } from "vitest";
import { scheduledWorldTime, useWorldStore } from "@/state/world-store";
import { allListings, listingsByTower, regressionListingsByTower } from "@/mock";
import { createStressListings } from "@/mock/stress-floors";

describe("Phase 2 world interaction state", () => {
  it("closes the drawer without losing rank and reopens it on navigation",()=>{
    const inventory=listingsByTower.companies;
    const state=useWorldStore.getState();
    state.selectListing(inventory[11].id,"companies");state.closeProfile();
    expect(useWorldStore.getState()).toMatchObject({selectedListingId:inventory[11].id,profileVisible:false,cameraMode:"selectedFloor"});
    state.travelFloors(inventory,1);
    expect(useWorldStore.getState()).toMatchObject({selectedListingId:inventory[12].id,profileVisible:true});
  });
  it("leaves temporary preview honestly when navigating the real demo inventory",()=>{
    const state=useWorldStore.getState();
    state.showFloorPreview({towerId:"companies",category:"technology",url:"preview.example",media:{id:"temporary",name:"Preview",description:"Only a preview",logoUrl:null,hiring:false,rank:24,totalPaidMinor:10000}});
    state.travelFloors(listingsByTower.companies,1);
    expect(useWorldStore.getState()).toMatchObject({floorPreview:null,selectedListingId:listingsByTower.companies[1].id});
  });
  it("offers an explicit focused wheel mode and resets it predictably",()=>{
    const state=useWorldStore.getState();state.resetWorld();state.toggleFocusedInputMode();
    expect(useWorldStore.getState().focusedInputMode).toBe("zoom");state.resetWorld();
    expect(useWorldStore.getState().focusedInputMode).toBe("floors");
  });
  it("keeps exact floor identity synchronized through traversal, reversal and bounds", () => {
    for (const inventory of [listingsByTower.companies, regressionListingsByTower.companies, createStressListings()]) {
      const state=useWorldStore.getState();
      state.selectListing(inventory[0].id,"companies");
      state.travelFloors(inventory,11);
      expect(useWorldStore.getState().selectedListingId).toBe(inventory.find(item=>item.rank===12)!.id);
      state.travelFloors(inventory,-11);
      expect(useWorldStore.getState().selectedListingId).toBe(inventory[0].id);
      for(let i=0;i<300;i++)state.travelFloors(inventory,1);
      expect(useWorldStore.getState().selectedListingId).toBe(inventory.at(-1)!.id);
      state.travelFloors(inventory,-999);
      expect(useWorldStore.getState()).toMatchObject({selectedListingId:inventory[0].id,cameraMode:"selectedFloor",towerTravelY:null,floorPreview:null});
    }
    const state=useWorldStore.getState();
    state.selectTower("products"); state.travelFloors(listingsByTower.products,1);
    expect(useWorldStore.getState()).toMatchObject({selectedTowerId:"products",selectedListingId:listingsByTower.products[1].id});
    state.resetWorld();
    expect(useWorldStore.getState().selectedListingId).toBeNull();
  });
  beforeEach(() => useWorldStore.setState({ selectedListingId: null, selectedTowerId: null, cameraMode: "overview", worldTime: "day" }));
  it("maps tower, floor and reset to camera modes", () => {
    for (const [towerId, expectedMode] of [["companies", "companiesTower"], ["products", "productsTower"], ["people", "peopleTower"]] as const) {
      useWorldStore.getState().selectTower(towerId);
      expect(useWorldStore.getState().cameraMode).toBe(expectedMode);
    }
    useWorldStore.getState().selectTower("products");
    expect(useWorldStore.getState().cameraMode).toBe("productsTower");
    const listing = allListings.find((item) => item.towerId === "products")!;
    useWorldStore.getState().selectListing(listing.id, listing.towerId);
    expect(useWorldStore.getState()).toMatchObject({ cameraMode: "selectedFloor", selectedListingId: listing.id });
    useWorldStore.getState().resetWorld();
    expect(useWorldStore.getState()).toMatchObject({ cameraMode: "overview", selectedListingId: null });
  });
  it("supports day, sunset and night without changing mock ranking", () => {
    const snapshot = allListings.map((item) => [item.id, item.rank, item.totalPaidMinor]);
    for (const time of ["day", "sunset", "night"] as const) {
      useWorldStore.getState().setWorldTime(time);
      expect(useWorldStore.getState().worldTime).toBe(time);
      expect(allListings.map((item) => [item.id, item.rank, item.totalPaidMinor])).toEqual(snapshot);
    }
  });
  it("maps browser-local schedule boundaries and preserves manual overrides", () => {
    expect(scheduledWorldTime(6, 0)).toBe("day");
    expect(scheduledWorldTime(15, 59)).toBe("day");
    expect(scheduledWorldTime(16, 0)).toBe("sunset");
    expect(scheduledWorldTime(18, 59)).toBe("sunset");
    expect(scheduledWorldTime(19, 0)).toBe("night");
    expect(scheduledWorldTime(5, 59)).toBe("night");
    useWorldStore.getState().setWorldTime("auto");
    expect(useWorldStore.getState().worldTime).toBe("auto");
    useWorldStore.getState().setWorldTime("day");
    expect(useWorldStore.getState().worldTime).toBe("day");
  });
  it("makes repeated overview resets distinct and bounds toolbar zoom", () => {
    useWorldStore.getState().resetWorld();
    const first = useWorldStore.getState().cameraResetVersion;
    useWorldStore.getState().zoomBy(10);
    expect(useWorldStore.getState().cameraDistance).toBe(1.12);
    useWorldStore.getState().resetWorld();
    expect(useWorldStore.getState().cameraResetVersion).toBe(first + 1);
    expect(useWorldStore.getState().cameraDistance).toBe(1);
    useWorldStore.getState().selectListing(allListings[0].id, allListings[0].towerId);
    useWorldStore.getState().zoomBy(-10);
    expect(useWorldStore.getState().cameraDistance).toBe(0.86);
  });
});
