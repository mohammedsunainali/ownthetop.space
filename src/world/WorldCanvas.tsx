"use client";

import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from "react";
import { resolveSharedFloor } from "@/domain/floor-share";
import { RankingFallback } from "@/components/fallback/RankingFallback";
import { formatMinorUnits } from "@/domain/money";
import { towers } from "@/mock/towers";
import { useWorldStore } from "@/state/world-store";
import { useWorldQuality } from "@/hooks/use-world-quality";
import { WorldScene } from "@/world/WorldScene";
import { getSceneListings } from "@/mock/stress-floors";
import { phase3Listings } from "@/mock/phase-3-fixture";
import { canUseWebGL } from "@/world/webgl-support";
import {currentStressFixture} from "@/mock/fixture-mode";

const noSubscribe = () => () => {};
const isStressMode = currentStressFixture;
const isArchitectureFixture = () => new URLSearchParams(window.location.search).get("architecture") === "phase3";
const isLegacyFixture = () => new URLSearchParams(window.location.search).get("regression") === "legacy";
const isListView = () => new URLSearchParams(window.location.search).get("view") === "2d";

class WorldErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function WorldCanvas({ onSceneReady, introReady }: { onSceneReady: () => void; introReady: boolean }) {
  const selectListing = useWorldStore((state) => state.selectListing);
  const selectTower = useWorldStore((state) => state.selectTower);
  const mobile = useWorldQuality();
  const webglSupported = useSyncExternalStore(noSubscribe, canUseWebGL, () => true);
  const stressMode = useSyncExternalStore(noSubscribe, isStressMode, () => false);
  const architectureFixture = useSyncExternalStore(noSubscribe, isArchitectureFixture, () => false);
  const legacyFixture = useSyncExternalStore(noSubscribe, isLegacyFixture, () => false);
  const listView = useSyncExternalStore(noSubscribe, isListView, () => false);
  const sceneListings = useMemo(() => architectureFixture && !stressMode ? phase3Listings : getSceneListings(stressMode,legacyFixture), [stressMode, architectureFixture,legacyFixture]);
  const sharedFloorApplied = useRef(false);
  useEffect(() => {
    if (!introReady || sharedFloorApplied.current) return;
    sharedFloorApplied.current = true;
    const listing = resolveSharedFloor(window.location.search, sceneListings);
    if (listing) selectListing(listing.id, listing.towerId);
  }, [introReady, sceneListings, selectListing]);
  useEffect(() => { if (!webglSupported || listView) onSceneReady(); }, [webglSupported, listView, onSceneReady]);

  return (
    <div className="world-canvas" tabIndex={0} aria-label="Interactive three-tower skyline" onKeyDown={event=>{
      if(event.target!==event.currentTarget && !(event.target instanceof HTMLCanvasElement))return;
      const state=useWorldStore.getState();
      if(event.key==="Escape") {event.preventDefault();if(state.selectedListingId&&state.profileVisible)state.closeProfile();else state.resetWorld();}
      if(state.cameraMode!=="overview"&&state.cameraMode!=="districtBuilding"&&(event.key==="ArrowUp"||event.key==="ArrowDown")){event.preventDefault();state.travelFloors(sceneListings[state.selectedTowerId??"companies"],event.key==="ArrowUp"?-1:1);}
    }} onPointerDown={(event) => {event.currentTarget.classList.add("world-canvas--dragging");if(event.target instanceof HTMLCanvasElement)event.currentTarget.focus({preventScroll:true});}} onPointerUp={(event) => event.currentTarget.classList.remove("world-canvas--dragging")} onPointerLeave={(event) => event.currentTarget.classList.remove("world-canvas--dragging")}>
      {!webglSupported || listView ? <RankingFallback inventory={sceneListings} requested={listView} /> : <WorldErrorBoundary fallback={<RankingFallback inventory={sceneListings} />}>
      <Canvas
        onPointerMissed={event=>{if(event.button===0)useWorldStore.getState().resetWorld();}}
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        shadows={mobile ? false : "percentage"}
        camera={{ position: [15, 8.5, 18], fov: 42, near: 0.1, far: 600 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <WorldScene listingsByTower={sceneListings} onSceneReady={onSceneReady} introReady={introReady} />
        </Suspense>
      </Canvas>
      </WorldErrorBoundary>}
      {stressMode ? <div className="stress-badge">QA fixture · 220 synthetic company floors · claims disabled</div> : null}
      <div className="top-leaders" aria-label="Current tower leaders">
        {towers.map((tower) => {
          const leader = sceneListings[tower.id].find((listing) => listing.rank === 1);
          if (!leader) return null;
          return (
            <button key={tower.id} className="scene-label" type="button" onClick={() => stressMode ? selectTower(tower.id) : selectListing(leader.id, tower.id)}>
              <span>{stressMode ? `${tower.name} · ${sceneListings[tower.id].length} synthetic` : `${tower.name} #1`}</span>
              {stressMode ? null : formatMinorUnits(leader.totalPaidMinor)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
