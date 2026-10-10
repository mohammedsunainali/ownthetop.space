import { describe, expect, it } from "vitest";
import { celestialDirection } from "./SkyAtmosphere";
describe("celestial light contract", () => {
  it("uses a shared above-horizon sun/moon direction", () => {
    for (const time of ["day", "sunset", "night"] as const) expect(celestialDirection(time)[1]).toBeGreaterThan(0);
    expect(celestialDirection("day")).not.toEqual(celestialDirection("sunset"));
    expect(celestialDirection("night")).toEqual([11, 18, 12]);
  });
});
