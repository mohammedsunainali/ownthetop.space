import { describe, expect, it } from "vitest";
import { aircraftConfigurations } from "@/world/aircraft/AircraftSystem";
import { MascotSlot } from "@/world/mascot/MascotSlot";

describe("Phase 2 scene asset boundaries", () => {
  it("configures exactly two planes, one helicopter and two drones", () => {
    expect(aircraftConfigurations.filter((item) => item.kind === "plane")).toHaveLength(2);
    expect(aircraftConfigurations.filter((item) => item.kind === "helicopter")).toHaveLength(1);
    expect(aircraftConfigurations.filter((item) => item.kind === "drone")).toHaveLength(2);
  });
  it("does not substitute a 3D mascot when the approved GLB is unavailable", () => {
    expect(MascotSlot({ position: [0, 0, 0] })).toBeNull();
  });
});
