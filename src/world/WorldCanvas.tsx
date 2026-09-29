"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { formatMinorUnits } from "@/domain/money";
import { listingsByTower } from "@/mock";
import { towers } from "@/mock/towers";
import { useWorldStore } from "@/state/world-store";
import { WorldScene } from "@/world/WorldScene";

function CanvasFallback() {
  return (
    <div className="webgl-fallback" role="status">
      <strong>3D skyline unavailable</strong>
      <span>WebGL is required to explore the tower world.</span>
    </div>
  );
}

export function WorldCanvas() {
  const selectListing = useWorldStore((state) => state.selectListing);

  return (
    <div className="world-canvas" aria-label="Interactive three-tower skyline">
      <Canvas
        dpr={[1, 1.75]}
        shadows
        camera={{ position: [15, 8.5, 18], fov: 42, near: 0.1, far: 120 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        fallback={<CanvasFallback />}
      >
        <Suspense fallback={null}>
          <WorldScene />
        </Suspense>
      </Canvas>
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
