import { describe, expect, it } from "vitest";
import { applyTimeToWorldMaterials, worldMaterials } from "@/world/materials/world-materials";

describe("time-of-day material states", () => {
  it("reuses facade materials while changing light levels", () => {
    const floor = worldMaterials.floor.blue;
    applyTimeToWorldMaterials("day");
    expect(floor.emissiveIntensity).toBe(0);
    applyTimeToWorldMaterials("sunset");
    expect(floor.emissiveIntensity).toBeGreaterThan(0);
    applyTimeToWorldMaterials("night");
    expect(floor.emissiveIntensity).toBeGreaterThan(0.1);
    expect(worldMaterials.floor.blue).toBe(floor);
  });
});
