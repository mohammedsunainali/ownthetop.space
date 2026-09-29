"use client";

import { useWorldStore } from "@/state/world-store";

export function WorldControls() {
  const resetWorld = useWorldStore((state) => state.resetWorld);
  const zoomBy = useWorldStore((state) => state.zoomBy);
  const rotateWorld = useWorldStore((state) => state.rotateWorld);
  const floorsExploded = useWorldStore((state) => state.floorsExploded);
  const toggleFloorsExploded = useWorldStore((state) => state.toggleFloorsExploded);
  const worldTime = useWorldStore((state) => state.worldTime);
  const toggleWorldTime = useWorldStore((state) => state.toggleWorldTime);

  return (
    <nav className="world-controls" aria-label="Scene controls">
      <button type="button" onClick={resetWorld}>Reset</button>
      <button type="button" onClick={() => zoomBy(-0.14)} aria-label="Zoom in">＋</button>
      <button type="button" onClick={() => zoomBy(0.14)} aria-label="Zoom out">−</button>
      <button type="button" onClick={rotateWorld}>Rotate</button>
      <button type="button" aria-pressed={floorsExploded} onClick={toggleFloorsExploded}>Floors</button>
      <button type="button" aria-pressed={worldTime === "night"} onClick={toggleWorldTime}>{worldTime === "day" ? "Night" : "Day"}</button>
    </nav>
  );
}
