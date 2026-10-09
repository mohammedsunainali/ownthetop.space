import { softBox } from "./soft-box";

/** Geometry-only element so architectural meshes keep their existing event/material contracts. */
export function SoftBox({ args, radius = 0.06 }: { args: readonly [number, number, number]; radius?: number }) {
  return <primitive object={softBox(...args, radius)} attach="geometry" dispose={null} />;
}
