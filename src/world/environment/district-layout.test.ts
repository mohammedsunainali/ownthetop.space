import { describe, expect, it } from "vitest";
import { districtLayout, routeHeading, routePoint } from "@/world/environment/district-layout";

describe("district mobility routes", () => {
  it("keeps every vehicle lane inside the visible ring road", () => {
    for (const lane of [0.983, 1.017]) for (let step = 0; step < 100; step++) {
      const [x, z] = routePoint(districtLayout.road.x * lane, districtLayout.road.z * lane, step / 100);
      const normalized = Math.hypot(x / districtLayout.road.x, z / districtLayout.road.z);
      expect(normalized).toBeGreaterThan(0.955);
      expect(normalized).toBeLessThan(1.045);
    }
  });

  it("keeps walking loops off the road and faces motion", () => {
    const [x, z] = routePoint(districtLayout.walkway.x, districtLayout.walkway.z, 0);
    expect(x).toBe(districtLayout.walkway.x);
    expect(z).toBeCloseTo(0);
    expect(Math.hypot(x / districtLayout.road.x, z / districtLayout.road.z)).toBeLessThan(0.89);
    expect(routeHeading(10, 6, 0, 1)).toBeCloseTo(-Math.PI / 2);
    expect(routeHeading(10, 6, 0, -1)).toBeCloseTo(Math.PI / 2);
  });
});
