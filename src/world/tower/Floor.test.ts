import { describe, expect, it, vi } from "vitest";
import { companies } from "@/mock/companies";
import { listingForInstance } from "@/world/tower/Floor";
import { createFloorSignTexture, floorSignCacheSize } from "@/world/tower/floor-signs";

describe("instanced ranked floor picking", () => {
  it("maps every wing instance back to one listing", () => {
    for (let index = 0; index < companies.length; index++) {
      for (let wing = 0; wing < 3; wing++) expect(listingForInstance(companies, index * 3 + wing)?.id).toBe(companies[index].id);
    }
    expect(listingForInstance(companies, companies.length * 3)).toBeUndefined();
  });
  it("reuses facade media for unchanged listing display state", () => {
    const canvas = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as never);
    const first = createFloorSignTexture(companies[0]);
    expect(createFloorSignTexture(companies[0])).toBe(first);
    expect(floorSignCacheSize()).toBeGreaterThan(0);
    canvas.mockRestore();
  });
});
