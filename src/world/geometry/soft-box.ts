import { BoxGeometry, type BufferGeometry } from "three";
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
  if (typeof window === "undefined") return "subtle";
  const query = new URLSearchParams(window.location.search);
  if (query.get("diagnostics") !== "1") return "subtle";
  const value = query.get("edgeProfile");
  return value === "current" || value === "strong" ? value : "subtle";
}

export function structuralBox(width: number, height: number, depth: number): BufferGeometry {
  const profile = structuralEdgeProfile();
  const radius = height <= 0.2 ? (profile === "strong" ? 0.04 : 0.025) : profile === "strong" ? 0.14 : 0.10;
  return softBox(width, height, depth, profile === "current" ? 0 : radius);
}
