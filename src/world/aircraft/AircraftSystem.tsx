import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, Group, Vector3 } from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { worldMaterials } from "@/world/materials/world-materials";

type AircraftKind = "plane" | "helicopter" | "drone";
export const aircraftConfigurations: readonly { kind: AircraftKind; offset: number; altitude: number; radius: number }[] = [
  { kind: "plane", offset: 0, altitude: 12.5, radius: 16 },
  { kind: "plane", offset: 0.48, altitude: 15, radius: 19 },
  { kind: "helicopter", offset: 0.22, altitude: 9.8, radius: 12 },
  { kind: "drone", offset: 0.16, altitude: 8, radius: 9 },
  { kind: "drone", offset: 0.69, altitude: 10.3, radius: 11 },
];

function AircraftShape({ kind }: { kind: AircraftKind }) {
  return <group scale={kind === "drone" ? 0.42 : kind === "helicopter" ? 0.7 : 0.85}>
    <mesh material={worldMaterials.podium}><boxGeometry args={kind === "plane" ? [0.4, 0.24, 1.8] : [0.55, 0.32, 1.05]} /></mesh>
    <mesh material={worldMaterials.crown} position={[0, 0.02, 0.15]}><boxGeometry args={kind === "drone" ? [1.3, 0.08, 0.18] : [1.7, 0.08, 0.25]} /></mesh>
    {kind === "helicopter" ? <mesh material={worldMaterials.frame} position={[0, 0.34, 0]}><boxGeometry args={[1.6, 0.05, 0.1]} /></mesh> : null}
    <mesh material={worldMaterials.aircraftLight} position={[0.82, 0.08, 0.12]}><sphereGeometry args={[0.055, 6, 6]} /></mesh>
  </group>;
}

export function AircraftSystem({ mobile }: { mobile: boolean }) {
  const reducedMotion = useReducedMotion();
  const refs = useRef<(Group | null)[]>([]);
  const curves = useMemo(() => aircraftConfigurations.map((item, index) => new CatmullRomCurve3([
    new Vector3(item.radius, item.altitude, -3 + index),
    new Vector3(2, item.altitude + 0.4, item.radius),
    new Vector3(-item.radius, item.altitude, 1 - index),
    new Vector3(-2, item.altitude - 0.3, -item.radius),
  ], true)), []);
  useFrame(({ clock }) => {
    if (reducedMotion) return;
    refs.current.forEach((group, index) => {
      if (!group) return;
      const position = curves[index].getPoint((clock.elapsedTime * (index < 2 ? 0.012 : 0.02) + aircraftConfigurations[index].offset) % 1);
      const tangent = curves[index].getTangent((clock.elapsedTime * (index < 2 ? 0.012 : 0.02) + aircraftConfigurations[index].offset) % 1);
      group.position.copy(position);
      group.rotation.y = Math.atan2(tangent.x, tangent.z);
    });
  });
  return <group>
    {aircraftConfigurations.map((item, index) => <group key={index} ref={(group) => { refs.current[index] = group; }} position={[item.radius, item.altitude, 0]} visible={!mobile || index < 3}>
      <AircraftShape kind={item.kind} />
    </group>)}
  </group>;
}
