import { describe, expect, it } from "vitest";
import { plazaPerson } from "./plaza-life";
import { districtLayout } from "./district-layout";
describe("intentional garden activity", () => {
  it("keeps walkers out of the fountain and on the garden path", () => {
    for (let t = 0; t < 300; t++) for (let i = 0; i < 4; i++) {
      const p = plazaPerson(t, i), z = p.z - districtLayout.park.center[2];
      expect((p.x / 4.7) ** 2 + (z / 1.8) ** 2).toBeGreaterThan(1);
      expect(p.y).toBe(0.18);
    }
  });
  it("pauses continuously and keeps seated residents stationary", () => {
    expect(plazaPerson(17, 0)).toEqual(plazaPerson(19.99, 0));
    expect(Math.abs(plazaPerson(20, 0).x - plazaPerson(19.99, 0).x)).toBeLessThan(0.01);
    expect(plazaPerson(0, 4)).toEqual(plazaPerson(500, 4));
    expect(plazaPerson(0, 5).seated).toBe(true);
  });
});
