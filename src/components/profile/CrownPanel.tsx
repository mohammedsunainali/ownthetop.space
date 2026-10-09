"use client";
import { useState } from "react";
import { useWorldStore } from "@/state/world-store";
import { useCrownStore } from "@/state/crown-store";
import { useInspectionFocus } from "@/hooks/use-inspection-focus";
export function CrownPanel() {
  const mode=useWorldStore(state=>state.cameraMode), tower=useWorldStore(state=>state.selectedTowerId);
  const preview=useCrownStore(state=>state.preview), clear=useCrownStore(state=>state.clear);
  const name=useCrownStore(state=>state.previewName);
  const [draft,setDraft]=useState("");
  const heading=useInspectionFocus(mode==="rooftop"&&(!tower||tower==="companies"));
  if(mode!=="rooftop" || tower && tower!=="companies")return null;
  return <aside className="profile-drawer profile-drawer--detail crown-panel" aria-label="Crown Showroom information" onKeyDown={event=>{if(event.key==="Escape"){event.stopPropagation();useWorldStore.getState().resetWorld();}}}>
    <div className="profile-drawer__body">
      <div className="profile-drawer__topline"><strong>DEMO SHOWROOM</strong><button className="profile-close" aria-label="Close Crown inspection" onClick={()=>useWorldStore.getState().resetWorld()}>×</button></div>
      <h2 ref={heading} tabIndex={-1}>Explore the Crown</h2><p className="profile-description">A separate rooftop concept above the ranked floors. Northstar Foundry remains ranked #1. Availability, pricing and booking terms are not activated.</p>
      <form onSubmit={event=>{event.preventDefault();preview(draft);}}><label>Your brand preview<input aria-label="Crown preview brand" value={draft} maxLength={48} onChange={event=>setDraft(event.target.value)} /></label><button className="profile-share" type="submit">Preview Crown message</button></form>
      {name?<><p role="status">Unpaid visual preview: {name}. No reservation or purchase.</p><button className="profile-share" onClick={clear}>Clear Crown preview</button></>:null}
      <p className="profile-description">Drag to explore the glass showroom, terrace and pool. This demonstration is not an offer of real estate or an investment.</p>
    </div>
  </aside>;
}
