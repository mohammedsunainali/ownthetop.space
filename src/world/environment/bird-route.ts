import { getTowerHeight } from "@/world/tower/tower-layout";

/** A distant flock stays beyond the aircraft's maximum 19-unit route radius. */
export function birdPose(seconds: number, index: number, floorCount: number, exploded = false) {
  const angle = seconds * 0.035 + index * 0.035;
  const radiusX = 40 + index * 0.4, radiusZ = 32 + index * 0.3;
  return {
    position: [Math.cos(angle) * radiusX, getTowerHeight(floorCount, exploded) + 8 + index * 0.18, Math.sin(angle) * radiusZ] as [number, number, number],
    heading: Math.atan2(-Math.sin(angle) * radiusX, Math.cos(angle) * radiusZ),
  };
}
