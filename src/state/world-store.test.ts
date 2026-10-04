import { beforeEach, describe, expect, it } from "vitest";
import { scheduledWorldTime, useWorldStore } from "@/state/world-store";
import { allListings } from "@/mock";

describe("Phase 2 world interaction state", () => {
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
});
