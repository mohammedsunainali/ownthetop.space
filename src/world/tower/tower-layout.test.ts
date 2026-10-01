import { describe, expect, it } from "vitest";
import { getArchitecturalHeightFeet, getFloorFootprint, getFloorY, getTowerHeight, towerVisuals } from "@/world/tower/tower-layout";

describe("Phase 2 procedural tower", () => {
  it("keeps one rank per paid floor with rank one physically highest", () => {
    for (const count of [10, 20, 60]) {
      const positions = Array.from({ length: count }, (_, index) => getFloorY(index + 1, count));
      expect(new Set(positions).size).toBe(count);
      expect(positions[0]).toBe(Math.max(...positions));
    }
  });
  it("tapers consistently for short and future taller towers", () => {
    for (const count of [10, 20, 60]) {
      expect(getFloorFootprint(1, count)).toBeLessThan(getFloorFootprint(count, count));
      expect(getFloorFootprint(1, count)).toBeGreaterThan(0);
    }
  });
  it("uses one renderer configuration for all three IDs", () => {
    expect(Object.keys(towerVisuals).sort()).toEqual(["companies", "people", "products"]);
  });
  it("scales to 200+ paid floors without treating payment or pavilion as additional floors", () => {
    const count = 240;
    const floors = Array.from({ length: count }, (_, index) => getFloorY(index + 1, count));
    expect(floors).toHaveLength(count);
    expect(new Set(floors).size).toBe(count);
    expect(floors[0]).toBe(Math.max(...floors));
    expect(getTowerHeight(count)).toBeGreaterThan(floors[0]);
    expect(getArchitecturalHeightFeet(count)).toBeGreaterThan(getArchitecturalHeightFeet(20));
    // A cumulative amount never enters the floor-position or floor-count API.
  });
});
