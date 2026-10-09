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
import { CentralPlaza } from "./CentralPlaza";
import { DistrictStreets } from "./DistrictStreets";
import { celestialDirection, SkyAtmosphere } from "./SkyAtmosphere";
import { BirdLife } from "./BirdLife";
import { StudioReflections } from "./StudioReflections";

export function BasicEnvironment({ tallestFloorCount, companiesFloorCount, sideTowerFloorCount }: { tallestFloorCount: number; companiesFloorCount: number; sideTowerFloorCount: number }) {
  const timeMode = useWorldStore((state) => state.worldTime);
  const exploded = useWorldStore((state) => state.floorsExploded);
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
  const sunPosition = celestialDirection(time).map(value => value * 4) as [number, number, number];
  useEffect(() => { applyTimeToWorldMaterials(time); }, [time]);
  return <>
    <color attach="background" args={[palette.skyDeep]} />
    <SkyAtmosphere time={time} upper={palette.skyDeep} horizon={palette.horizon} />
    <fog attach="fog" args={[palette.horizon, Math.max(140,getTowerHeight(tallestFloorCount)*3),Math.max(270,getTowerHeight(tallestFloorCount)*5)]} />
    <StudioReflections mobile={mobile} night={night} />
    <ambientLight intensity={night ? 0.28 : 0.38} />
    <hemisphereLight args={[palette.skyMid, "#a8a08a", night ? 0.48 : 1.05]} />
    <directionalLight position={sunPosition} intensity={night ? 0.7 : time === "sunset" ? 1.9 : 2.5} color={night ? "#bccfff" : time === "sunset" ? "#ffd0a0" : "#fff2df"} castShadow={!mobile && tallestFloorCount < 80}
      shadow-mapSize={[1024, 1024]} shadow-bias={-0.00015} shadow-normalBias={0.035}
      shadow-camera-left={-38} shadow-camera-right={38} shadow-camera-top={42} shadow-camera-bottom={-38}
      shadow-camera-near={0.1} shadow-camera-far={Math.max(120, getTowerHeight(tallestFloorCount) * 2.5)} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.08, 0]}>
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial color={night ? environmentTokens.lawnNight : environmentTokens.lawn} roughness={0.88} />
    </mesh>
    <DistrictStreets />
    <CompanionSkyline mobile={mobile} night={night} />
    <WorldProps mobile={mobile} night={night} />
    <CentralPlaza />
    <CityLife mobile={mobile} night={night} />
    {!night && <BirdLife mobile={mobile} floorCount={tallestFloorCount} exploded={exploded} />}
    <AircraftSystem mobile={mobile} companiesFloorCount={companiesFloorCount} sideTowerFloorCount={sideTowerFloorCount} />
  </>;
}
