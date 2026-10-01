import { describe, expect, it } from "vitest";
import { helicopterPose } from "@/world/aircraft/AircraftSystem";
import { getHelipadWorldPosition } from "@/world/tower/tower-layout";

describe("deterministic helicopter loop", () => {
  it("approaches, lands on the connected pad, and departs", () => {
    expect(helicopterPose(5).phase).toBe("APPROACH");
    expect(helicopterPose(12).phase).toBe("HOVER");
    expect(helicopterPose(15).phase).toBe("DESCEND");
    const landed = helicopterPose(18);
    const [, padY, padZ] = getHelipadWorldPosition(20);
    expect(landed.phase).toBe("IDLE");
    expect(landed.position.y).toBeCloseTo(padY + 0.24);
    expect(landed.position.z).toBeCloseTo(padZ);
    expect(helicopterPose(26).phase).toBe("DEPART");
  });
});
