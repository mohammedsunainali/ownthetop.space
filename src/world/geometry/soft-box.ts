import { BoxGeometry, ExtrudeGeometry, Shape, type BufferGeometry } from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export type EdgeProfile = "current" | "subtle" | "strong";
const geometries = new Map<string, BufferGeometry>();

/** Module-owned geometry: shared for the lifetime of the world, never disposed by an instance. */
export function softBox(width: number, height: number, depth: number, radius: number, segments = 1): BufferGeometry {
  const clamped = Math.min(radius, Math.min(width, height, depth) * 0.45);
  const key = [width, height, depth, clamped, segments].join(":");
  let geometry = geometries.get(key);
  if (!geometry) {
    geometry = clamped === 0 ? new BoxGeometry(width, height, depth) : new RoundedBoxGeometry(width, height, depth, segments, clamped);
    geometries.set(key, geometry);
  }
  return geometry;
}

/** Comparison switch is deliberately restricted to explicit QA sessions. */
export function structuralEdgeProfile(): EdgeProfile {
  if (typeof window === "undefined") return "strong";
  const query = new URLSearchParams(window.location.search);
  if (query.get("diagnostics") !== "1") return "strong";
  const value = query.get("edgeProfile");
  return value === "current" || value === "subtle" || value === "strong" ? value : "strong";
}

export function structuralBox(width: number, height: number, depth: number): BufferGeometry {
  const profile = structuralEdgeProfile();
  if (profile === "current") return softBox(width, height, depth, height <= .2 ? .025 : .10);
  return roundedPlanBox(width, height, depth, profile === "strong" ? .30 : .24, true);
}

/** Rounded X/Z silhouette independent of slab thickness; flat caps retain exact pitch and bounds. */
export function roundedPlanBox(width: number, height: number, depth: number, radius: number, bevelled = false): BufferGeometry {
  const b = bevelled ? Math.min(.018,height*.1) : 0;
  const r = Math.min(radius, width / 2, depth / 2)-b, x = width / 2-b, z = depth / 2-b;
  const key = `plan:${width}:${height}:${depth}:${r}:${b}`;
  const existing = geometries.get(key);
  if (existing) return existing;
  const shape = new Shape();
  shape.moveTo(-x + r, -z);
  shape.lineTo(x-r,-z); shape.quadraticCurveTo(x,-z,x,-z+r);
  shape.lineTo(x,z-r); shape.quadraticCurveTo(x,z,x-r,z);
  shape.lineTo(-x+r,z); shape.quadraticCurveTo(-x,z,-x,z-r);
  shape.lineTo(-x,-z+r); shape.quadraticCurveTo(-x,-z,-x+r,-z);
  const geometry = new ExtrudeGeometry(shape, {depth:height-2*b, bevelEnabled:bevelled, bevelSize:b, bevelThickness:b, bevelSegments:1, curveSegments:3, steps:1});
  geometry.rotateX(-Math.PI / 2).translate(0,-height/2+b,0);
  geometries.set(key, geometry);
  return geometry;
}
