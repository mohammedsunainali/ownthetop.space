import { describe, expect, it } from "vitest";
import { Box3, Vector3 } from "three";
import { districtRandom, neighborhoodBounds, neighborhoodBuildings, neighborhoodRoads } from "./neighborhood-layout";
import { outsideTowerApproaches } from "./district-layout";
describe("seeded neighborhood blocks", () => {
  it("is stable, varied and excludes tower approaches", () => {
    expect(districtRandom(19)).toBe(districtRandom(19));
    expect(neighborhoodBuildings.length).toBeGreaterThan(40);
    expect(new Set(neighborhoodBuildings.map(b => b.height)).size).toBeGreaterThan(10);
    expect(Math.max(...neighborhoodBuildings.map(b => b.height)) - Math.min(...neighborhoodBuildings.map(b => b.height))).toBeGreaterThan(7);
    expect(new Set(neighborhoodBuildings.map(b => b.style)).size).toBe(3);
    expect(neighborhoodBuildings.every(b => outsideTowerApproaches(b, 2))).toBe(true);
  });
  it("keeps roads, sidewalks and other buildings clear", () => {
    for (const [index, bounds] of neighborhoodBounds.entries()) {
      for (const road of neighborhoodRoads) {
        const route = new Box3(new Vector3(road.x - road.width / 2 - 0.4, 0, road.z - road.depth / 2 - 0.4), new Vector3(road.x + road.width / 2 + 0.4, 10, road.z + road.depth / 2 + 0.4));
        expect(bounds.intersectsBox(route)).toBe(false);
      }
      for (const other of neighborhoodBounds.slice(index + 1)) expect(bounds.intersectsBox(other)).toBe(false);
    }
  });
});
