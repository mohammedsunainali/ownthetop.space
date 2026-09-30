"use client";

import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useSyncExternalStore, type ReactNode } from "react";
import { RankingFallback } from "@/components/fallback/RankingFallback";
import { formatMinorUnits } from "@/domain/money";
import { listingsByTower } from "@/mock";
import { towers } from "@/mock/towers";
import { useWorldStore } from "@/state/world-store";
import { useWorldQuality } from "@/hooks/use-world-quality";
import { WorldScene } from "@/world/WorldScene";
import { canUseWebGL } from "@/world/webgl-support";

const noSubscribe = () => () => {};

class WorldErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <RankingFallback /> : this.props.children; }
}

export function WorldCanvas() {
  const selectListing = useWorldStore((state) => state.selectListing);
  const mobile = useWorldQuality();
  const webglSupported = useSyncExternalStore(noSubscribe, canUseWebGL, () => true);

  return (
    <div className="world-canvas" aria-label="Interactive three-tower skyline">
      {!webglSupported ? <RankingFallback /> : <WorldErrorBoundary>
      <Canvas
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        shadows={!mobile}
        camera={{ position: [15, 8.5, 18], fov: 42, near: 0.1, far: 120 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <WorldScene />
        </Suspense>
      </Canvas>
      </WorldErrorBoundary>}
      <div className="top-leaders" aria-label="Current tower leaders">
        {towers.map((tower) => {
          const leader = listingsByTower[tower.id].find((listing) => listing.rank === 1)!;
          return (
            <button key={tower.id} className="scene-label" type="button" onClick={() => selectListing(leader.id, tower.id)}>
              <span>{tower.name} #1</span>
              {formatMinorUnits(leader.totalPaidMinor)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
