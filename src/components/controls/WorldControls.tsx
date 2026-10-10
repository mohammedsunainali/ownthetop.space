"use client";

import { useWorldStore } from "@/state/world-store";
import { useEffect, useRef, useState } from "react";
import { skylineAudio } from "@/world/audio/audio-engine";
import { getSceneListings } from "@/mock/stress-floors";
import {districtInventory} from "@/world/environment/district-inventory";
import {currentStressFixture} from "@/mock/fixture-mode";

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
  const focusedInputMode = useWorldStore((state) => state.focusedInputMode);
  const toggleFocusedInputMode = useWorldStore((state) => state.toggleFocusedInputMode);
  const selectedTowerId = useWorldStore((state) => state.selectedTowerId);
  const travelFloors = useWorldStore((state) => state.travelFloors);
  const travelOneFloor = (direction: number) => {
    const id = selectedTowerId ?? "companies";
    const stressMode = currentStressFixture();
    const inventory=getSceneListings(stressMode,typeof window!=="undefined"&&new URLSearchParams(window.location.search).get("regression")==="legacy");
    travelFloors(inventory[id], -direction);
  };
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const handleSound = async () => {
    const accepted = await skylineAudio.enable(!soundEnabled);
    setAudioUnavailable(!accepted);
    if (accepted) toggleSound();
  };

  const [panel, setPanel] = useState<"view" | "sky" | "more" | null>(null);
  const dock = useRef<HTMLElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!panel) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setPanel(null); lastTrigger.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (!dock.current?.contains(event.target as Node)) setPanel(null);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); };
  }, [panel]);
  const openPanel = (value: "view" | "sky" | "more", target: HTMLButtonElement) => {
    lastTrigger.current = target;
    setPanel(current => current === value ? null : value);
  };
  const focused = cameraMode !== "overview" && cameraMode !== "districtBuilding";
  const action = (label: string, icon: string, handler: () => void, active = false, extra = "") =>
    <button className={`control-dock__action ${extra}`} type="button" title={label} aria-label={label} aria-pressed={label === "Top floor" || label === "Crown" ? active : undefined} onClick={handler}><DockIcon name={icon}/><span>{label}</span></button>;
  return (
    <nav ref={dock} className="world-controls control-dock" aria-label="Scene controls">
      <div className="control-dock__rail">
        {action("Rotate", "rotate", rotateWorld)}
        {action("Top floor", "top", focusTop, cameraMode === "topFloor")}
        {action("Crown", "crown", focusRooftop, cameraMode === "rooftop")}
        <span className="control-dock__divider" />
        {action("Zoom in", "plus", () => zoomBy(-.14), false, "control-dock__desktop")}
        {action("Zoom out", "minus", () => zoomBy(.14), false, "control-dock__desktop")}
        {([ ["view", "View & display", "layers"], ["sky", "Environment", "sun"], ["more", "More actions", "more"] ] as const).map(([id, label, icon]) => <button key={id} type="button" className="control-dock__action" title={label} aria-label={label} aria-expanded={panel === id} aria-controls="control-dock-panel" onClick={event => openPanel(id, event.currentTarget)}><DockIcon name={icon}/><span>{id === "sky" ? "Sky" : id === "more" ? "More" : "View"}</span></button>)}
        <span className="control-dock__divider" />
        {action("Reset", "reset", resetWorld)}
      </div>
      {panel && <section id="control-dock-panel" className="control-dock__panel" aria-label={panel === "sky" ? "Environment settings" : panel === "view" ? "View settings" : "More scene actions"}>
        <header><strong>{panel === "sky" ? "Atmosphere" : panel === "view" ? "Your viewpoint" : "Explore the skyline"}</strong><button type="button" aria-label="Close control panel" onClick={() => {setPanel(null); lastTrigger.current?.focus();}}>×</button></header>
        {panel === "sky" ? <>
          <div className="control-dock__segments" aria-label="Sky time">{(["auto", "day", "sunset", "night"] as const).map(time => <button key={time} type="button" aria-pressed={worldTime === time} onClick={() => setWorldTime(time)}>{time === "auto" ? "Auto" : time === "day" ? "Day" : time === "sunset" ? "Sunset" : "Night"}</button>)}</div>
          <button type="button" aria-pressed={soundEnabled} onClick={handleSound}><DockIcon name="sound"/>{soundEnabled ? "Sound on" : "Sound off"}</button>
          {soundEnabled && <label>Volume <input aria-label="World sound volume" type="range" min="0" max="1" step="0.05" defaultValue="0.35" onChange={event => skylineAudio.setVolume(Number(event.target.value))}/></label>}
          {audioUnavailable && <p role="status">Audio unavailable</p>}
        </> : panel === "view" ? <>
          <div className="control-dock__pair"><button type="button" aria-label="Zoom in" onClick={() => zoomBy(-.14)}>＋ Zoom</button><button type="button" aria-label="Zoom out" onClick={() => zoomBy(.14)}>− Zoom</button></div>
          <button type="button" aria-pressed={rulerVisible} onClick={toggleRuler}><DockIcon name="height"/>Height ruler</button>
          <button type="button" aria-pressed={floorsExploded} onClick={toggleFloorsExploded}><DockIcon name="layers"/>Separate floors</button>
          {focused && <><div className="control-dock__pair"><button type="button" onClick={() => travelOneFloor(1)} aria-label="Travel one floor up">↑ Floor</button><button type="button" onClick={() => travelOneFloor(-1)} aria-label="Travel one floor down">↓ Floor</button></div><button type="button" onClick={toggleFocusedInputMode} aria-label="Change focused scroll input mode">Scroll: {focusedInputMode === "floors" ? "Floors" : "Zoom"}</button></>}
        </> : <>
          <button type="button" onClick={() => { const building = districtInventory.find(item => item.inventory.kind === "preview"); if (building) useWorldStore.getState().selectDistrictBuilding(building.id); setPanel(null); }}>District previews ↗</button>
          <button type="button" onClick={() => { const url = new URL(window.location.href); url.searchParams.set("view", "2d"); window.location.assign(url.toString()); }}>2D list ↗</button>
          <p>Drag to orbit. Select a floor to read its profile.</p>
        </>}
      </section>}
    </nav>
  );
}

function DockIcon({name}:{name:string}) {
  const paths: Record<string,string> = {
    rotate: "M20 8a8 8 0 1 0 0 8 M20 3v5h-5",
    reset: "M4 8a8 8 0 1 1 0 8 M4 3v5h5",
    top: "M5 20V9h14v11 M3 5h18 M9 20v-5h6v5",
    crown: "M3 7l4 4 5-7 5 7 4-4-2 12H5Z",
    plus: "M12 5v14 M5 12h14", minus: "M5 12h14",
    layers: "M3 8l9-5 9 5-9 5Z M3 13l9 5 9-5 M3 18l9 5 9-5",
    sun: "M12 3v2 M12 19v2 M3 12h2 M19 12h2 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    more: "M5 6h14 M5 12h14 M5 18h14", height: "M8 3h8 M12 3v18 M8 21h8 M16 8h3 M16 12h3 M16 16h3",
    sound: "M4 9h4l5-5v16l-5-5H4Z M17 8a6 6 0 0 1 0 8 M20 5a10 10 0 0 1 0 14",
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>;
}
