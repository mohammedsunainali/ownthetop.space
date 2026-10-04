"use client";

import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { RankingFallback } from "@/components/fallback/RankingFallback";
import { formatMinorUnits } from "@/domain/money";
import { towers } from "@/mock/towers";
import { useWorldStore } from "@/state/world-store";
import { useWorldQuality } from "@/hooks/use-world-quality";
import { WorldScene } from "@/world/WorldScene";
import { getSceneListings } from "@/mock/stress-floors";
import { canUseWebGL } from "@/world/webgl-support";

const noSubscribe = () => () => {};
const isStressMode = () => process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).get("stressFloors") === "220";

class WorldErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <RankingFallback /> : this.props.children; }
}

export function WorldCanvas() {
  const selectListing = useWorldStore((state) => state.selectListing);
  const selectTower = useWorldStore((state) => state.selectTower);
  const mobile = useWorldQuality();
  const webglSupported = useSyncExternalStore(noSubscribe, canUseWebGL, () => true);
  const stressMode = useSyncExternalStore(noSubscribe, isStressMode, () => false);
  const sceneListings = useMemo(() => getSceneListings(stressMode), [stressMode]);

  return (
    <div className="world-canvas" aria-label="Interactive three-tower skyline">
      {!webglSupported ? <RankingFallback /> : <WorldErrorBoundary>
      <Canvas
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        shadows={mobile ? false : "basic"}
        camera={{ position: [15, 8.5, 18], fov: 42, near: 0.1, far: 600 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <WorldScene listingsByTower={sceneListings} />
        </Suspense>
      </Canvas>
      </WorldErrorBoundary>}
      {stressMode ? <div className="stress-badge">Development fixture · 220 synthetic company floors</div> : null}
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
