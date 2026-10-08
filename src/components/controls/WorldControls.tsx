"use client";

import { useWorldStore } from "@/state/world-store";
import { useEffect, useRef } from "react";
import { listingsByTower } from "@/mock";
import { FLOOR_PITCH, getCrownHeight, getFloorY, getTowerHeight } from "@/world/tower/tower-layout";

export function WorldControls() {
  const resetWorld = useWorldStore((state) => state.resetWorld);
  const zoomBy = useWorldStore((state) => state.zoomBy);
  const rotateWorld = useWorldStore((state) => state.rotateWorld);
  const floorsExploded = useWorldStore((state) => state.floorsExploded);
  const toggleFloorsExploded = useWorldStore((state) => state.toggleFloorsExploded);
  const worldTime = useWorldStore((state) => state.worldTime);
  const setWorldTime = useWorldStore((state) => state.setWorldTime);
  const focusTop = useWorldStore((state) => state.focusTop);
  const focusRooftop = useWorldStore((state) => state.focusRooftop);
  const rulerVisible = useWorldStore((state) => state.rulerVisible);
  const toggleRuler = useWorldStore((state) => state.toggleRuler);
  const soundEnabled = useWorldStore((state) => state.soundEnabled);
  const toggleSound = useWorldStore((state) => state.toggleSound);
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const selectedTowerId = useWorldStore((state) => state.selectedTowerId);
  const travelTowerBy = useWorldStore((state) => state.travelTowerBy);
  const travelOneFloor = (direction: number) => {
    const id = selectedTowerId ?? "companies";
    const stressMode = process.env.NODE_ENV === "development" && typeof window !== "undefined" && new URLSearchParams(window.location.search).get("stressFloors") === "220";
    const count = stressMode ? (id === "companies" ? 220 : 0) : listingsByTower[id].length;
    if (count === 0) return;
    travelTowerBy(direction * FLOOR_PITCH, 1.1, getTowerHeight(count) + getCrownHeight(count) - 0.7, getFloorY(1, count));
  };
  const audio = useRef<AudioContext | null>(null);
  useEffect(() => () => { void audio.current?.close(); }, []);
  const handleSound = () => {
    if (!audio.current) {
      const context = new AudioContext();
      const gain = context.createGain();
      gain.gain.value = 0.006;
      gain.connect(context.destination);
      for (const frequency of [62, 93]) {
        const tone = context.createOscillator();
        tone.type = "sine";
        tone.frequency.value = frequency;
        tone.connect(gain);
        tone.start();
      }
      audio.current = context;
    }
    if (soundEnabled) void audio.current.suspend(); else void audio.current.resume();
    toggleSound();
  };

  return (
    <nav className="world-controls" aria-label="Scene controls">
      <div className="world-controls__group"><span>View</span><button type="button" onClick={resetWorld}>Reset</button></div>
      <div className="world-controls__group"><span>Zoom</span><div className="world-controls__pair"><button type="button" onClick={() => zoomBy(-0.14)} aria-label="Zoom in">＋</button><button type="button" onClick={() => zoomBy(0.14)} aria-label="Zoom out">−</button></div></div>
      <div className="world-controls__group"><span>Navigate</span><button type="button" onClick={rotateWorld}>Rotate</button><button type="button" onClick={focusTop}>Top floor</button><button type="button" onClick={focusRooftop}>Crown</button>{cameraMode !== "overview" ? <><button className="floor-travel-button" type="button" onClick={() => travelOneFloor(1)} aria-label="Travel one floor up">↑ Floor</button><button className="floor-travel-button" type="button" onClick={() => travelOneFloor(-1)} aria-label="Travel one floor down">↓ Floor</button></> : null}</div>
      <div className="world-controls__group"><span>Display</span><button type="button" aria-pressed={rulerVisible} onClick={toggleRuler}>Height</button><button type="button" aria-pressed={soundEnabled} onClick={handleSound}>{soundEnabled ? "Sound on" : "Sound off"}</button><button type="button" aria-pressed={floorsExploded} onClick={toggleFloorsExploded}>Floors</button></div>
      <div className="world-controls__group"><span>Environment</span><label className="time-control">Sky <select aria-label="Sky time" value={worldTime} onChange={(event) => setWorldTime(event.target.value as "auto" | "day" | "sunset" | "night")}><option value="auto">Auto</option><option value="day">Day</option><option value="sunset">Sunset</option><option value="night">Night</option></select></label></div>
    </nav>
  );
}
