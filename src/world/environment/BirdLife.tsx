import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { birdPose } from "./bird-route";

export function BirdLife({ mobile, floorCount, exploded }: { mobile: boolean; floorCount: number; exploded: boolean }) {
  const birds = useRef<(Group | null)[]>([]), wings = useRef<(Group | null)[]>([]);
  const reduced = useReducedMotion();
  useFrame(({ clock }) => {
    if (reduced) return;
    birds.current.forEach((bird, index) => {
      if (!bird) return;
      const pose = birdPose(clock.elapsedTime, index, floorCount, exploded);
      bird.position.set(...pose.position); bird.rotation.y = pose.heading;
      for (let side = 0; side < 2; side++) {
        const wing = wings.current[index * 2 + side];
        if (wing) wing.rotation.z = (side ? -1 : 1) * Math.sin(clock.elapsedTime * 5 + index * 0.3) * 0.45;
      }
    });
  });
  return <group>{Array.from({ length: mobile ? 2 : 4 }, (_, index) => <group key={index} ref={node => { birds.current[index] = node; }} position={birdPose(0, index, floorCount, exploded).position}>
    <mesh><boxGeometry args={[0.06, 0.05, 0.22]} /><meshStandardMaterial color="#334250" /></mesh>
    {[-1, 1].map((side, wing) => <group key={side} ref={node => { wings.current[index * 2 + wing] = node; }}><mesh position={[side * 0.14, 0, -0.02]} rotation={[0, side * 0.3, 0]}><boxGeometry args={[0.26, 0.025, 0.08]} /><meshStandardMaterial color="#334250" /></mesh></group>)}
  </group>)}</group>;
}
