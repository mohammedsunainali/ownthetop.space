import { describe, expect, it } from "vitest";
import { Box3, Vector3 } from "three";
import { helicopterPose } from "@/world/aircraft/AircraftSystem";
import { getHelipadWorldPosition, getTowerHeight, towerLocalToWorld } from "@/world/tower/tower-layout";

describe("deterministic helicopter loop", () => {
  it("keeps the complete horizontal rotor sweep clear of the villa and billboard throughout every phase", () => {
    for (const count of [24, 50, 220]) for (const exploded of [false, true]) {
      const roof = getTowerHeight(count, exploded);
      const obstacles = [[[-3.35, roof + 0.2, -2.85], [0.55, roof + 2.14, 0.15]], [[-3.85, roof + 2.7, -1.36], [2.05, roof + 3.74, -1.24]]] as const;
      const boxes = obstacles.map(([min, max]) => new Box3(new Vector3(...towerLocalToWorld("companies", min)), new Vector3(...towerLocalToWorld("companies", max))));
      for (let tick = 0; tick <= 2900; tick++) {
        const { position } = helicopterPose(tick / 100, count, exploded);
        const center = position.clone().add(new Vector3(0, 0.35 * 0.72, 0));
        const rotor = new Box3(center.clone().add(new Vector3(-0.56, -0.015, -0.56)), center.clone().add(new Vector3(0.56, 0.015, 0.56)));
        for (const obstacle of boxes) expect(rotor.intersectsBox(obstacle)).toBe(false);
      }
    }
  });
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
