import { describe, expect, it } from "vitest";
import { entranceBounds } from "./TowerEntrance";
import { FLOOR_BASE_Y } from "./tower-layout";
import { RECTANGULAR_TOWER } from "./rectangular-layout";
describe("non-advertising lobby details", () => {
  it("never enters bottom-floor content or the tower approach envelope", () => {
    expect(entranceBounds.maxY).toBeLessThan(FLOOR_BASE_Y - RECTANGULAR_TOWER.floorHeight / 2);
    expect(entranceBounds.halfWidth).toBeLessThan(RECTANGULAR_TOWER.width / 2);
    expect(entranceBounds.faceZ).toBeLessThan(3.35);
  });
});
