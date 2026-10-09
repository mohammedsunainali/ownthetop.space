import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useWorldStore, scheduledWorldTime } from "@/state/world-store";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { helicopterPose } from "@/world/aircraft/AircraftSystem";
import { getTowerHeight, towerLocalToWorld } from "@/world/tower/tower-layout";
import { skylineAudio } from "./audio-engine";

export function WorldAudio({ companiesFloorCount }: { companiesFloorCount: number }) {
  const exploded = useWorldStore(state => state.floorsExploded), time = useWorldStore(state => state.worldTime);
  const reduced = useReducedMotion();
  const vectors = useMemo(() => ({ direction: new Vector3(), up: new Vector3() }), []);
  useEffect(() => () => skylineAudio.dispose(), []);
  useFrame(({ camera, clock }) => {
    if (!skylineAudio.context) return;
    const helicopter = helicopterPose(reduced ? 0 : clock.elapsedTime, companiesFloorCount, exploded);
    camera.getWorldDirection(vectors.direction); vectors.up.copy(camera.up).applyQuaternion(camera.quaternion);
    const now = new Date(), night = (time === "auto" ? scheduledWorldTime(now.getHours(), now.getMinutes()) : time) === "night";
    skylineAudio.update(camera.position.toArray(), vectors.direction.toArray(), vectors.up.toArray(), towerLocalToWorld("companies", [1.4, getTowerHeight(companiesFloorCount, exploded) + 0.315, 1.8]), helicopter.position.toArray(), helicopter.phase === "IDLE" || helicopter.phase === "LAND", night);
  });
  return null;
}
