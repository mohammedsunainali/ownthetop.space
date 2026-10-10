import { roundedPlanBox, softBox } from "./soft-box";

/** Geometry-only element so architectural meshes keep their existing event/material contracts. */
export function SoftBox({ args, radius = 0.06 }: { args: readonly [number, number, number]; radius?: number }) {
  return <primitive object={softBox(...args, radius)} attach="geometry" dispose={null} />;
}

/** Plan roundness stays visible on thin architectural caps without changing their height. */
export function RoundedPlanBox({args,radius=.24}:{args:readonly[number,number,number];radius?:number}) {
  return <primitive object={roundedPlanBox(...args,radius)} attach="geometry" dispose={null}/>;
}
