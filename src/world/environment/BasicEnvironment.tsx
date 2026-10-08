import { tokens } from "@/design/tokens";
import { useWorldStore } from "@/state/world-store";
import { useEffect, useState } from "react";
import { useWorldQuality } from "@/hooks/use-world-quality";
import { CompanionSkyline } from "@/world/environment/CompanionSkyline";
import { WorldProps } from "@/world/environment/WorldProps";
import { CityLife } from "@/world/environment/CityLife";
import { AircraftSystem } from "@/world/aircraft/AircraftSystem";
import { applyTimeToWorldMaterials } from "@/world/materials/world-materials";
import { scheduledWorldTime } from "@/state/world-store";
import { environmentTokens } from "@/world/environment/environment-tokens";
import { getTowerHeight } from "@/world/tower/tower-layout";

export function BasicEnvironment({ tallestFloorCount, companiesFloorCount, sideTowerFloorCount }: { tallestFloorCount: number; companiesFloorCount: number; sideTowerFloorCount: number }) {
  const timeMode = useWorldStore((state) => state.worldTime);
  const [localHour, setLocalHour] = useState(() => new Date().getHours());
  useEffect(() => {
    if (timeMode !== "auto") return;
    const update = () => setLocalHour(new Date().getHours());
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [timeMode]);
  const now = new Date();
  const time = timeMode === "auto" ? scheduledWorldTime(localHour, now.getMinutes()) : timeMode;
  const mobile = useWorldQuality();
  const palette = tokens.environment[time];
  const night = time === "night";
  useEffect(() => { applyTimeToWorldMaterials(time); }, [time]);
  return <>
    <color attach="background" args={[palette.skyDeep]} />
    <fog attach="fog" args={[palette.horizon, Math.max(140,getTowerHeight(tallestFloorCount)*3),Math.max(270,getTowerHeight(tallestFloorCount)*5)]} />
    <ambientLight intensity={night ? 0.42 : 0.82} />
    <hemisphereLight args={[palette.skyMid, tokens.color.brand.navy, night ? 0.45 : 1.1]} />
    <directionalLight position={time === "sunset" ? [-12, 11, 6] : [11, 18, 12]} intensity={night ? 0.85 : time === "sunset" ? 1.7 : 2.2} color={time === "sunset" ? tokens.color.brand.peach : tokens.color.brand.white} castShadow={!mobile} shadow-mapSize={mobile ? [512, 512] : [1024, 1024]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.08, 0]}>
      <circleGeometry args={[23, 64]} />
      <meshStandardMaterial color={night ? environmentTokens.lawnNight : environmentTokens.lawn} roughness={0.88} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.13, 0]}>
      <circleGeometry args={[25.5, 64]} />
      <meshStandardMaterial color={palette.water} metalness={0.22} roughness={0.48} />
    </mesh>
    <CompanionSkyline mobile={mobile} night={night} />
    <WorldProps mobile={mobile} night={night} />
    <CityLife mobile={mobile} />
    <AircraftSystem mobile={mobile} companiesFloorCount={companiesFloorCount} sideTowerFloorCount={sideTowerFloorCount} />
  </>;
}
