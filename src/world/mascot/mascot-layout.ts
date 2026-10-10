import { Box3, Object3D, Vector3 } from "three";
/** Clone only the approved character, preserving cached source geometry/materials. */
export function normalizeMascot(source: Object3D, height = 0.55): Object3D {
  const root = source.clone(true);
  const bounds = new Box3().setFromObject(root), size = bounds.getSize(new Vector3()), center = bounds.getCenter(new Vector3());
  if (!Number.isFinite(size.y) || size.y <= 0) return root;
  const factor = height / size.y;
  root.scale.multiplyScalar(factor);
  root.position.set(-center.x * factor, -bounds.min.y * factor, -center.z * factor);
  root.updateMatrixWorld(true);
  return root;
}
