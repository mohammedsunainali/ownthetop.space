import { describe, expect, it } from "vitest";
import { showroomResidentPose, swimmerPose } from "./rooftop-life";
describe("bounded rooftop swimming", () => {
  it("keeps the complete swimmer inside water, away from pad and terrace", () => {
    for (let t = 0; t < 1000; t += 0.2) {
      const pose = swimmerPose(t);
      expect(pose.x - 0.28).toBeGreaterThan(1.4 - 1.125);
      expect(pose.x + 0.28).toBeLessThan(1.4 + 1.125);
      expect(pose.z - 0.28).toBeGreaterThan(1.8 - 0.725);
      expect(pose.z + 0.28).toBeLessThan(1.8 + 0.725);
      expect(Number.isFinite(pose.rotation)).toBe(true);
    }
  });
  it("keeps showroom walking and waiting grounded, inside glazing and away from furniture/pad/pool", () => {
    for (let t = 0; t < 200; t += 0.1) {
      const pose = showroomResidentPose(t);
      expect(pose.y).toBe(0.31);
      expect(pose.x - 0.12).toBeGreaterThan(-3.15);
      expect(pose.x + 0.12).toBeLessThan(0.35);
      expect(pose.z + 0.12).toBeLessThan(-0.015);
      expect(pose.z - 0.12).toBeGreaterThan(-0.6); // coffee table's front edge
    }
    expect(showroomResidentPose(7).stride).toBe(0);
    expect(showroomResidentPose(7).rotation).toBe(0);
    expect(showroomResidentPose(17.999).x).toBeCloseTo(showroomResidentPose(18).x);
  });
});
