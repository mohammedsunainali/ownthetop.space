import { describe, expect, it } from "vitest";
import { cityDetails } from "./city-details";
import { neighborhoodBounds, neighborhoodBuildings } from "./neighborhood-layout";
import { Vector3 } from "three";
describe("bounded original city architecture", () => {
  it("keeps all details inside the canonical sightline/collision bounds", () => {
    for (const detail of cityDetails) {
      const bounds = neighborhoodBounds[detail.buildingIndex];
      for (const side of [-1, 1]) expect(bounds.containsPoint(new Vector3(...detail.position.map((value, axis) => value + side * detail.size[axis] / 2)))).toBe(true);
    }
  });
  it("gives every material family a distinct original architectural rhythm", () => {
    const roles = Array.from({ length: 8 }, (_, index) => [...new Set(cityDetails.filter(d => neighborhoodBuildings[d.buildingIndex].archetype === index).map(d => d.role))].join("/"));
    expect(new Set(roles).size).toBe(8); expect(roles.every(Boolean)).toBe(true);
    expect(cityDetails.length).toBeLessThan(neighborhoodBuildings.length * 5);
  });
});
