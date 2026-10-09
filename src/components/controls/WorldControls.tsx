"use client";

import { useWorldStore } from "@/state/world-store";
import { useState } from "react";
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

  return (
    <nav className="world-controls" aria-label="Scene controls">
      {cameraMode!=="overview"&&cameraMode!=="districtBuilding"?<button type="button" onClick={toggleFocusedInputMode} aria-label="Change focused scroll input mode">Scroll: {focusedInputMode === "floors" ? "Floors" : "Zoom"}</button>:null}
      <div className="world-controls__group"><span>View</span><button type="button" onClick={resetWorld}>Reset</button></div>
      <div className="world-controls__group"><span>Zoom</span><div className="world-controls__pair"><button type="button" onClick={() => zoomBy(-0.14)} aria-label="Zoom in">＋</button><button type="button" onClick={() => zoomBy(0.14)} aria-label="Zoom out">−</button></div></div>
      <div className="world-controls__group"><span>Navigate</span><button type="button" onClick={rotateWorld}>Rotate</button><button type="button" onClick={focusTop}>Top floor</button><button type="button" onClick={focusRooftop}>Crown</button>{cameraMode !== "overview"&&cameraMode!=="districtBuilding" ? <><button className="floor-travel-button" type="button" onClick={() => travelOneFloor(1)} aria-label="Travel one floor up">↑ Floor</button><button className="floor-travel-button" type="button" onClick={() => travelOneFloor(-1)} aria-label="Travel one floor down">↓ Floor</button></> : null}</div>
      <div className="world-controls__group"><span>Display</span><button type="button" aria-pressed={rulerVisible} onClick={toggleRuler}>Height</button><button type="button" aria-pressed={soundEnabled} onClick={handleSound}>{soundEnabled ? "Sound on" : "Sound off"}</button><button type="button" aria-pressed={floorsExploded} onClick={toggleFloorsExploded}>Floors</button></div>
      <div className="world-controls__group"><span>Environment</span><label className="time-control">Sky <select aria-label="Sky time" value={worldTime} onChange={(event) => setWorldTime(event.target.value as "auto" | "day" | "sunset" | "night")}><option value="auto">Auto</option><option value="day">Day</option><option value="sunset">Sunset</option><option value="night">Night</option></select></label></div>
      {soundEnabled && <label style={{ fontSize: 11 }}>Volume <input aria-label="World sound volume" type="range" min="0" max="1" step="0.05" defaultValue="0.35" onChange={event => skylineAudio.setVolume(Number(event.target.value))} style={{ width: 70 }} /></label>}
      {audioUnavailable && <span role="status">Audio unavailable</span>}
      <button type="button" onClick={()=>{const building=districtInventory.find(item=>item.inventory.kind==="preview");if(building)useWorldStore.getState().selectDistrictBuilding(building.id);}}>District previews</button>
      <button type="button" onClick={() => { const url = new URL(window.location.href); url.searchParams.set("view", "2d"); window.location.assign(url.toString()); }}>2D list</button>
    </nav>
  );
}
