"use client";

import { useWorldStore } from "@/state/world-store";

export function WorldControls() {
  const resetWorld = useWorldStore((state) => state.resetWorld);
  const zoomBy = useWorldStore((state) => state.zoomBy);
  const rotateWorld = useWorldStore((state) => state.rotateWorld);
  const floorsExploded = useWorldStore((state) => state.floorsExploded);
  const toggleFloorsExploded = useWorldStore((state) => state.toggleFloorsExploded);
  const worldTime = useWorldStore((state) => state.worldTime);
  const setWorldTime = useWorldStore((state) => state.setWorldTime);

  return (
    <nav className="world-controls" aria-label="Scene controls">
      <button type="button" onClick={resetWorld}>Reset</button>
      <button type="button" onClick={() => zoomBy(-0.14)} aria-label="Zoom in">＋</button>
      <button type="button" onClick={() => zoomBy(0.14)} aria-label="Zoom out">−</button>
      <button type="button" onClick={rotateWorld}>Rotate</button>
      <button type="button" aria-pressed={floorsExploded} onClick={toggleFloorsExploded}>Floors</button>
      <label className="time-control">Sky <select aria-label="Sky time" value={worldTime} onChange={(event) => setWorldTime(event.target.value as "day" | "sunset" | "night")}><option value="day">Day</option><option value="sunset">Sunset</option><option value="night">Night</option></select></label>
    </nav>
  );
}
