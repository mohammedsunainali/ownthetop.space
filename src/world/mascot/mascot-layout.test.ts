import { describe, expect, it } from "vitest";
import { Box3, BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { normalizeMascot } from "./mascot-layout";
describe("approved mascot normalization", () => {
  it("grounds the copied character without mutating the cached asset", () => {
    const original = new Group(), mesh = new Mesh(new BoxGeometry(4, 6, 2), new MeshBasicMaterial());
    mesh.position.set(1, 4, 0); original.add(mesh);
    const root = normalizeMascot(original), box = new Box3().setFromObject(root);
    expect(box.min.y).toBeCloseTo(0);
    expect(box.getSize(new Vector3()).y).toBeCloseTo(0.55);
    expect(box.getCenter(new Vector3()).x).toBeCloseTo(0);
    expect(original.scale.y).toBe(1);
    expect(original.children[0].position.y).toBe(4);
  });
});
