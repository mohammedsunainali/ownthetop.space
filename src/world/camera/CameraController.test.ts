import { describe, expect, it } from "vitest";
import { beginFocusedWheel, clampTowerTravel, focusedWheelAction, shouldRunIntro, towerCameraWorldY, yieldCameraToManualControl } from "@/world/camera/CameraController";
import { getCrownHeight, getFloorY, getTowerHeight, towerVisuals } from "@/world/tower/tower-layout";

describe("tower camera travel", () => {
  it("preserves accepted floor movement through trailing and reversed wheel events", () => {
    const intro={interrupted:false}, transition={current:.75}, manual={current:false};
    for(let i=0;i<20;i++)beginFocusedWheel("travel",intro,transition,manual);
    expect(intro.interrupted).toBe(true);
    expect(transition.current).toBe(.75);
    expect(manual.current).toBe(false);
  });
  it("still yields scripted motion for focused zoom", () => {
    const intro={interrupted:false}, transition={current:.75}, manual={current:false};
    beginFocusedWheel("zoom",intro,transition,manual);
    expect(transition.current).toBe(0);
    expect(manual.current).toBe(true);
  });
  it("clamps below podium and above crown for canonical and 220 floors", () => {
    for (const count of [10, 20, 220]) {
      expect(clampTowerTravel(-100, count)).toBe(1.1);
      expect(clampTowerTravel(9999, count)).toBeCloseTo(getTowerHeight(count) + getCrownHeight(count) - 0.7);
    }
  });
  it("aims at scaled world-space floor elevations on all three towers", () => {
    for (const towerId of ["companies", "products", "people"] as const) {
      const localY = getFloorY(1, towerId === "companies" ? 50 : 20);
      expect(towerCameraWorldY(towerId, localY)).toBeCloseTo(towerVisuals[towerId].position[1] + localY * towerVisuals[towerId].scale);
    }
    expect(towerCameraWorldY("people", getFloorY(1, 20))).toBe(getFloorY(1, 20));
  });
  it("skips cinematic movement for reduced motion", () => {
    expect(shouldRunIntro(true)).toBe(false);
    expect(shouldRunIntro(false)).toBe(true);
  });
  it("separates focused vertical travel from trackpad pinch zoom", () => {
    expect(focusedWheelAction({ ctrlKey: false, metaKey: false })).toBe("travel");
    expect(focusedWheelAction({ ctrlKey: false, metaKey: false,shiftKey:true })).toBe("zoom");
    expect(focusedWheelAction({ ctrlKey: true, metaKey: false })).toBe("zoom");
    expect(focusedWheelAction({ ctrlKey: false, metaKey: true })).toBe("zoom");
  });
  it("cancels scripted interpolation when OrbitControls takes manual authority", () => {
    const intro = { interrupted: false };
    const transition = { current: 1 };
    const manual = { current: false };
    yieldCameraToManualControl(intro, transition, manual);
    expect(intro.interrupted).toBe(true);
    expect(transition.current).toBe(0);
    expect(manual.current).toBe(true);
  });
});
