import { describe, expect, it } from "vitest";
import { companies, people, products } from "@/mock";
import { createStressListings, getSceneListings } from "@/mock/stress-floors";
import { getFloorY, getNearestFloorRank } from "@/world/tower/tower-layout";
import { visibleFloorSigns } from "@/world/tower/floor-signs";

describe("development floor load", () => {
  it("keeps canonical Phase 2 demo counts unchanged", () => {
    expect([companies.length, products.length, people.length]).toEqual([50, 20, 20]);
    expect(getSceneListings(false).companies).toBe(companies);
  });
  it("maps 220 synthetic listings to 220 ranked floors, with #1 highest", () => {
    const fixture = createStressListings();
    expect(fixture).toHaveLength(220);
    expect(new Set(fixture.map((listing) => listing.id)).size).toBe(220);
    expect(fixture[0].rank).toBe(1);
    expect(getFloorY(fixture[0].rank, fixture.length)).toBeGreaterThan(getFloorY(fixture[219].rank, fixture.length));
    expect(getNearestFloorRank(getFloorY(170, fixture.length), fixture.length)).toBe(170);
    expect(visibleFloorSigns(fixture, fixture[109].id, true).length).toBe(5);
    expect(visibleFloorSigns(fixture, null, false).length).toBe(1);
    const scene = getSceneListings(true);
    expect([...scene.companies, ...scene.products, ...scene.people]).toHaveLength(220);
  });
});
