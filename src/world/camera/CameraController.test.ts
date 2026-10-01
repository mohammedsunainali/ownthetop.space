import { describe, expect, it } from "vitest";
import { clampTowerTravel, shouldRunIntro } from "@/world/camera/CameraController";
import { getCrownHeight, getTowerHeight } from "@/world/tower/tower-layout";

describe("tower camera travel", () => {
  it("clamps below podium and above crown for canonical and 220 floors", () => {
    for (const count of [10, 20, 220]) {
      expect(clampTowerTravel(-100, count)).toBe(1.1);
      expect(clampTowerTravel(9999, count)).toBeCloseTo(getTowerHeight(count) + getCrownHeight(count) - 0.7);
    }
  });
  it("skips cinematic movement for reduced motion", () => {
    expect(shouldRunIntro(true)).toBe(false);
    expect(shouldRunIntro(false)).toBe(true);
  });
});
