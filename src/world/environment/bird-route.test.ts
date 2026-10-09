import { expect, it } from "vitest";
import { birdPose } from "./bird-route";
import { getTowerHeight } from "@/world/tower/tower-layout";

it("keeps the deterministic distant flock beyond aircraft and tower envelopes", () => {
  for (const count of [24, 50, 220]) for (const exploded of [false, true]) for (let second = 0; second < 180; second++) {
    const { position: [x, y, z], heading } = birdPose(second, 3, count, exploded);
    expect(Math.hypot(x, z)).toBeGreaterThan(32);
    expect(y).toBeGreaterThan(getTowerHeight(count, exploded) + 7);
    expect(Number.isFinite(heading)).toBe(true);
    expect(birdPose(second, 3, count, exploded)).toEqual(birdPose(second, 3, count, exploded));
  }
});
