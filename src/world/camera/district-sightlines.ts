import { Box3, Ray, Vector3 } from "three";
import type { TowerId } from "@/domain/tower";
import { getCrownHeight, getTowerHeight, towerLocalToWorld, towerVisuals } from "@/world/tower/tower-layout";
import { segmentIntersectsSphere, vegetationBounds } from "@/world/environment/vegetation-layout";
import { neighborhoodBounds } from "@/world/environment/neighborhood-layout";
import { timedNavigation } from "@/world/navigation-performance";

export type AdvertisementFace = "front" | "rear" | "identity" | "ranking";

export function facingAdvertisement(towerId: TowerId, eye: Vector3): AdvertisementFace {
  const tower = towerVisuals[towerId], delta = eye.clone().sub(new Vector3(...tower.position));
  delta.applyAxisAngle(new Vector3(0, 1, 0), -tower.rotation);
  return Math.abs(delta.z) >= Math.abs(delta.x) ? delta.z >= 0 ? "front" : "rear" : delta.x < 0 ? "identity" : "ranking";
}

/** Samples the complete content rectangle, including the hanging slate. */
export function advertisementSamples(towerId: TowerId, y: number, face: AdvertisementFace): Vector3[] {
  const side = face === "identity" || face === "ranking";
  const halfWidth = side ? 1.98 : 3.19;
  return [-halfWidth, -halfWidth / 2, 0, halfWidth / 2, halfWidth].flatMap(u => [-0.59, 0, 0.59].map(v => {
    const local: [number, number, number] = side ? [face === "identity" ? -3.49 : 3.49, y + v, u] : [u, y + v, face === "front" ? 2.25 : -2.25];
    return new Vector3(...towerLocalToWorld(towerId, local));
  }));
}

export function towerWorldBounds(id: TowerId, count: number, exploded = false): Box3 {
  const position = towerVisuals[id].position;
  return new Box3(new Vector3(position[0] - 3.95, position[1], position[2] - 3.35),
    new Vector3(position[0] + 3.95, position[1] + getTowerHeight(count, exploded) + getCrownHeight(count), position[2] + 3.35));
}

export function segmentIntersectsBox(eye: Vector3, target: Vector3, bounds: Box3): boolean {
  const hit = new Ray(eye, target.clone().sub(eye).normalize()).intersectBox(bounds, new Vector3());
  return bounds.containsPoint(eye) || !!hit && hit.distanceTo(eye) < eye.distanceTo(target) - 0.01;
}

export function inspectionBlocked(eye: Vector3, id: TowerId, y: number, counts: Record<TowerId, number>, exploded = false): boolean {
  const samples = advertisementSamples(id, y, facingAdvertisement(id, eye));
  const buildings = (Object.keys(counts) as TowerId[]).filter(other => other !== id).map(other => towerWorldBounds(other, counts[other], exploded));
  const roof = getTowerHeight(counts[id], exploded);
  // The selected tower's shaft is the target surface, not an occluder. Its roof is not.
  const roofObstacles = [
    [[-3.9, roof, -3.3], [3.9, roof + 0.2, 3.3]],
    [[-3.35, roof + 0.2, -2.85], [0.55, roof + 2.14, 0.15]],
    [[-3.85, roof + 2.7, -1.36], [2.05, roof + 3.74, -1.24]],
  ] as const;
  const ownRoof = roofObstacles.map(([min, max]) => new Box3(new Vector3(...towerLocalToWorld(id, min)), new Vector3(...towerLocalToWorld(id, max))));
  const obstacles = [...buildings, ...neighborhoodBounds, ...ownRoof];
  return samples.some(target => vegetationBounds.some(bound => segmentIntersectsSphere(eye, target, bound.center, bound.radius)) ||
    obstacles.some(bounds => segmentIntersectsBox(eye, target, bounds)));
}

/** Preserve heading first; gently raise or shift it only when actual content rays are blocked. */
export function safeInspectionOffset(target: Vector3, offset: Vector3, id: TowerId, y: number, counts: Record<TowerId, number>, exploded = false): Vector3 {
  return timedNavigation("sightlineSearchMs", () => searchInspectionOffset(target, offset, id, y, counts, exploded));
}
function searchInspectionOffset(target: Vector3, offset: Vector3, id: TowerId, y: number, counts: Record<TowerId, number>, exploded = false): Vector3 {
  if (!inspectionBlocked(target.clone().add(offset), id, y, counts, exploded)) return offset;
  const radius = Math.hypot(offset.x, offset.z), base = Math.atan2(offset.x, offset.z);
  for (const turn of [0, 0.15, -0.15, 0.3, -0.3, 0.55, -0.55, 0.8, -0.8, 1.2, -1.2]) {
    for (const rise of [offset.y, radius * 0.06, radius * 0.12, radius * 0.3, radius * 0.6, radius]) {
      const candidate = new Vector3(Math.sin(base + turn) * radius, rise, Math.cos(base + turn) * radius);
      if (!inspectionBlocked(target.clone().add(candidate), id, y, counts, exploded)) return candidate;
    }
  }
  return offset; // Unresolved diagnostics/QA must not be misrepresented as a guarantee.
}
