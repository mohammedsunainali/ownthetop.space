import { describe, expect, it } from "vitest";
import { Vector3 } from "three";
import { helicopterPose } from "@/world/aircraft/AircraftSystem";
import { getHelipadWorldPosition, getTowerHeight } from "@/world/tower/tower-layout";

describe("deterministic helicopter loop", () => {
  it("joins departure to cruise without a cycle teleport",()=>{
    expect(helicopterPose(29-0.0001,24).position.distanceTo(helicopterPose(29,24).position)).toBeLessThan(0.001);
  });
  it("approaches, lands on the connected pad, and departs", () => {
    expect(helicopterPose(5, 20).phase).toBe("APPROACH");
    expect(helicopterPose(12, 20).phase).toBe("HOVER");
    expect(helicopterPose(15, 20).phase).toBe("DESCEND");
    const landed = helicopterPose(18, 20);
    const [, padY, padZ] = getHelipadWorldPosition(20);
    expect(landed.phase).toBe("IDLE");
    expect(landed.position.y).toBeCloseTo(padY);
    expect(landed.position.z).toBeCloseTo(padZ);
    expect(helicopterPose(26, 20).phase).toBe("DEPART");
  });
  it("uses the rendered pad anchor at current and stress heights", () => {
    for (const count of [20, 50, 220]) {
      const anchor = getHelipadWorldPosition(count);
      const landed = helicopterPose(17, count);
      expect(landed.phase).toBe("LAND");
      expect(landed.position.distanceTo(new Vector3(...anchor))).toBeLessThan(0.0001);
      expect(landed.position.y).toBeGreaterThan(getTowerHeight(count));
      expect(helicopterPose(12, count).position.y).toBeGreaterThan(landed.position.y);
    }
    expect(getHelipadWorldPosition(50)[1]).toBeGreaterThan(getHelipadWorldPosition(20)[1]);
  });
});
