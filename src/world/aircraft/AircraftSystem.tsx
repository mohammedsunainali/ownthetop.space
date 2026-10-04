import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CanvasTexture, CatmullRomCurve3, DoubleSide, Group, SRGBColorSpace, Vector3 } from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { worldMaterials } from "@/world/materials/world-materials";
import { getHelipadWorldPosition } from "@/world/tower/tower-layout";
import { tokens } from "@/design/tokens";

type AircraftKind = "plane" | "helicopter" | "drone";
export const aircraftConfigurations: readonly { kind: AircraftKind; offset: number; altitude: number; radius: number }[] = [
  { kind: "plane", offset: 0, altitude: 12.5, radius: 16 },
  { kind: "plane", offset: 0.48, altitude: 15, radius: 19 },
  { kind: "helicopter", offset: 0.22, altitude: 9.8, radius: 12 },
  { kind: "drone", offset: 0.16, altitude: 8, radius: 9 },
  { kind: "drone", offset: 0.69, altitude: 10.3, radius: 11 },
];

export type HelicopterPhase = "CRUISE" | "APPROACH" | "ALIGN" | "HOVER" | "DESCEND" | "LAND" | "IDLE" | "ASCEND" | "DEPART";
export function helicopterPose(seconds: number, floorCount = 20): { phase: HelicopterPhase; position: Vector3 } {
  const [padX, padY, padZ] = getHelipadWorldPosition(floorCount);
  const segments: { phase: HelicopterPhase; duration: number; from: [number, number, number]; to: [number, number, number] }[] = [
    { phase: "CRUISE", duration: 4, from: [12, padY + 3, -6], to: [8, padY + 2.2, 5] },
    { phase: "APPROACH", duration: 4, from: [8, padY + 2.2, 5], to: [3, padY + 1.5, padZ + 2] },
    { phase: "ALIGN", duration: 3, from: [3, padY + 1.5, padZ + 2], to: [padX, padY + 1.2, padZ] },
    { phase: "HOVER", duration: 2, from: [padX, padY + 1.2, padZ], to: [padX, padY + 1.2, padZ] },
    { phase: "DESCEND", duration: 3, from: [padX, padY + 1.2, padZ], to: [padX, padY + 0.24, padZ] },
    { phase: "LAND", duration: 1, from: [padX, padY + 0.24, padZ], to: [padX, padY + 0.24, padZ] },
    { phase: "IDLE", duration: 3, from: [padX, padY + 0.24, padZ], to: [padX, padY + 0.24, padZ] },
    { phase: "ASCEND", duration: 3, from: [padX, padY + 0.24, padZ], to: [padX, padY + 1.4, padZ] },
    { phase: "DEPART", duration: 6, from: [padX, padY + 1.4, padZ], to: [-11, padY + 3.5, -8] },
  ];
  const cycle = segments.reduce((sum, item) => sum + item.duration, 0);
  let elapsed = ((seconds % cycle) + cycle) % cycle;
  for (const segment of segments) {
    if (elapsed <= segment.duration) {
      const t = elapsed / segment.duration;
      const eased = t * t * (3 - 2 * t);
      return { phase: segment.phase, position: new Vector3(...segment.from).lerp(new Vector3(...segment.to), eased) };
    }
    elapsed -= segment.duration;
  }
  return { phase: "CRUISE", position: new Vector3(...segments[0].from) };
}

function TowBanner({ copy, bannerRef }: { copy: string; bannerRef?: (group: Group | null) => void }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = 1536; canvas.height = 384;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = tokens.color.brand.summitGold; context.fillRect(0, 0, 1536, 384);
      context.strokeStyle = tokens.color.brand.navy; context.lineWidth = 22; context.strokeRect(11, 11, 1514, 362);
      context.fillStyle = tokens.color.brand.navy; context.textAlign = "center"; context.font = "800 104px Inter, system-ui, sans-serif";
      context.fillText(copy, 768, 230, 1390);
    }
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; map.anisotropy = 4; return map;
  }, [copy]);
  return <group ref={bannerRef} position={[0, -0.24, -3.55]}><mesh><planeGeometry args={[5.1, 1.2, 8, 1]} /><meshBasicMaterial map={texture} side={DoubleSide} toneMapped={false} /></mesh></group>;
}

function AircraftShape({ kind, index, rotorRef, bannerRef }: { kind: AircraftKind; index: number; rotorRef?: (group: Group | null) => void; bannerRef?: (group: Group | null) => void }) {
  return <group scale={kind === "drone" ? 0.42 : kind === "helicopter" ? 0.72 : 1.18}>
    <mesh material={worldMaterials.podium} scale={kind === "plane" ? [0.24, 0.18, 1.15] : [0.37, 0.24, 0.58]}><sphereGeometry args={[1, 10, 8]} /></mesh>
    <mesh material={worldMaterials.crown} position={[0, 0.02, 0.1]}><boxGeometry args={kind === "drone" ? [1.15, 0.07, 0.14] : kind === "plane" ? [2.0, 0.07, 0.31] : [1.48, 0.07, 0.16]} /></mesh>
    {kind === "plane" ? <><mesh material={worldMaterials.frame} position={[0, 0.16, -0.82]}><boxGeometry args={[0.07, 0.32, 0.2]} /></mesh><mesh material={worldMaterials.crown} position={[0, 0.08, -0.67]}><boxGeometry args={[0.72, 0.05, 0.13]} /></mesh><mesh material={worldMaterials.frame} position={[0, -0.18, -1.72]}><boxGeometry args={[0.025, 0.025, 1.7]} /></mesh><TowBanner bannerRef={bannerRef} copy={index === 0 ? "OWN THIS AIRSPACE" : "ADD YOUR DOMAIN HERE"} /></> : null}
    {kind === "helicopter" ? <><group ref={rotorRef} position={[0, 0.35, 0]}><mesh material={worldMaterials.frame}><boxGeometry args={[1.55, 0.04, 0.12]} /></mesh></group><mesh material={worldMaterials.frame} position={[0, 0.06, -0.9]}><boxGeometry args={[0.08, 0.08, 1.1]} /></mesh><mesh material={worldMaterials.frame} position={[0, 0.16, -1.42]}><boxGeometry args={[0.5, 0.04, 0.07]} /></mesh><mesh material={worldMaterials.frame} position={[-0.3, -0.24, 0]}><boxGeometry args={[0.035, 0.035, 0.74]} /></mesh><mesh material={worldMaterials.frame} position={[0.3, -0.24, 0]}><boxGeometry args={[0.035, 0.035, 0.74]} /></mesh></> : null}
    <mesh material={worldMaterials.aircraftLight} position={[0.82, 0.08, 0.12]}><sphereGeometry args={[0.055, 6, 6]} /></mesh>
  </group>;
}

export function AircraftSystem({ mobile }: { mobile: boolean }) {
  const reducedMotion = useReducedMotion();
  const refs = useRef<(Group | null)[]>([]);
  const rotor = useRef<Group | null>(null);
  const banners = useRef<(Group | null)[]>([]);
  const curves = useMemo(() => aircraftConfigurations.map((item, index) => new CatmullRomCurve3([
    new Vector3(item.radius, item.altitude, -3 + index),
    new Vector3(2, item.altitude + 0.4, item.radius),
    new Vector3(-item.radius, item.altitude, 1 - index),
    new Vector3(-2, item.altitude - 0.3, -item.radius),
    ], true)), []);
  useFrame(({ clock }) => {
    if (reducedMotion) return;
    if (rotor.current) rotor.current.rotation.y = clock.elapsedTime * 13;
    banners.current.forEach((banner, index) => { if (banner) banner.rotation.z = Math.sin(clock.elapsedTime * 1.2 + index) * 0.025; });
    refs.current.forEach((group, index) => {
      if (!group) return;
      if (index === 2) {
        const pose = helicopterPose(clock.elapsedTime);
        group.position.copy(pose.position);
        group.rotation.y = pose.phase === "DEPART" ? -0.8 : pose.phase === "CRUISE" ? 1.2 : 0;
        return;
      }
      const position = curves[index].getPoint((clock.elapsedTime * (index < 2 ? 0.012 : 0.02) + aircraftConfigurations[index].offset) % 1);
      const tangent = curves[index].getTangent((clock.elapsedTime * (index < 2 ? 0.012 : 0.02) + aircraftConfigurations[index].offset) % 1);
      group.position.copy(position);
      group.rotation.y = Math.atan2(tangent.x, tangent.z);
      group.rotation.z = index < 2 ? Math.sin(clock.elapsedTime * 0.28 + index) * 0.07 : 0;
    });
  });
  return <group>
    {aircraftConfigurations.map((item, index) => <group key={index} ref={(group) => { refs.current[index] = group; }} position={[item.radius, item.altitude, 0]} visible={!mobile || index < 3}>
      <AircraftShape kind={item.kind} index={index} rotorRef={item.kind === "helicopter" ? (group) => { rotor.current = group; } : undefined} bannerRef={item.kind === "plane" ? (group) => { banners.current[index] = group; } : undefined} />
    </group>)}
  </group>;
}
