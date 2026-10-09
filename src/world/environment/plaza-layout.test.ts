import { describe, expect, it } from "vitest";
import { pathTransform, plazaBeds, plazaPaths, plazaSeats } from "./plaza-layout";
import { districtTowers } from "./district-layout";
describe("triangular public plaza", () => {
  it("connects each tower without entering a podium", () => {
    expect(plazaPaths).toHaveLength(3);
    for (const route of plazaPaths) for (let i = 0; i <= 100; i++) {
      const x = route.from[0] + (route.to[0] - route.from[0]) * i / 100;
      const z = route.from[1] + (route.to[1] - route.from[1]) * i / 100;
      for (const tower of Object.values(districtTowers)) expect(Math.abs(x - tower.position[0]) > 3.95 || Math.abs(z - tower.position[2]) > 3.35).toBe(true);
    }
  });
  it("uses finite deterministic route and furniture transforms", () => {
    for (const route of plazaPaths) {
      const t = pathTransform(route.from, route.to);
      expect(t.length).toBeGreaterThan(0);
      expect(Number.isFinite(t.rotation)).toBe(true);
    }
    expect(plazaSeats).toHaveLength(4);
    expect(plazaBeds).toHaveLength(2);
  });
});
