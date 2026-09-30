import { describe, expect, it } from "vitest";
import { getFloorFootprint, getFloorY, towerVisuals } from "@/world/tower/tower-layout";

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
});
