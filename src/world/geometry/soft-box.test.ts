import { describe, expect, it } from "vitest";
import { softBox } from "./soft-box";
import { cityForms, cityCanopy, cityTrim } from "./city-forms";
import { advertisementBackplates, advertisementBackingMaterial } from "../tower/advertisement-backplates";

describe("shared premium geometry contracts", () => {
  it("preserves tower envelope and plane clearance for both radius candidates", () => {
    for (const radius of [0, 0.10, 0.14]) {
      const body = softBox(6.8, 1.2, 4.4, radius);
      body.computeBoundingBox();
      const bounds = body.boundingBox!;
      expect(bounds.max.x).toBeCloseTo(3.4, 5);
      expect(bounds.min.x).toBeCloseTo(-3.4, 5);
      expect(bounds.max.y).toBeCloseTo(0.6, 5);
      expect(bounds.max.z).toBeCloseTo(2.2, 5);
      expect(bounds.max.z).toBeLessThan(2.225);
      expect(body.getAttribute("position").count).toBeLessThanOrEqual(324);
    }
  });
  it("reuses identical geometry and keeps slender trim within its slab", () => {
    expect(softBox(7.04, .15, 4.64, .025)).toBe(softBox(7.04, .15, 4.64, .025));
    const slab = softBox(7.04,.15,4.64,.14);
    slab.computeBoundingBox();
    expect(slab.boundingBox!.max.y).toBeCloseTo(.075,5);
  });
  it("keeps every secondary archetype inside the canonical unit collision envelope", () => {
    for (const geometry of [...cityForms, cityCanopy]) {
      geometry.computeBoundingBox();
      const bounds = geometry.boundingBox!;
      for (const axis of ["x", "y", "z"] as const) {
        expect(bounds.max[axis]).toBeLessThanOrEqual(.500001);
        expect(bounds.min[axis]).toBeGreaterThanOrEqual(-.500001);
      }
    }
  });
  it("keeps frequent distant trim below forty triangles", () => {
    expect(cityTrim.getAttribute("position").count / 3).toBeLessThan(40);
  });
  it("isolates transparent ad backgrounds without bending or moving the artwork", () => {
    const positions = advertisementBackplates.getAttribute("position");
    expect(advertisementBackingMaterial.toneMapped).toBe(false);
    expect(advertisementBackingMaterial.color.getHexString()).toBe("0d284a");
    for (let index = 0; index < positions.count; index++) {
      expect(Math.abs(positions.getY(index))).toBeCloseTo(.6,5);
      expect(Math.abs(positions.getZ(index))).toBeLessThan(2.225);
      expect(Math.abs(positions.getX(index))).toBeLessThan(3.49);
    }
  });
});
