"use client";
import {useState} from "react";
import {useWorldStore} from "@/state/world-store";
import {districtBuilding,districtInventory} from "@/world/environment/district-inventory";
import {buildingAvailabilityLabel} from "@/domain/district-building";
import {useInspectionFocus} from "@/hooks/use-inspection-focus";
export function DistrictBuildingPanel(){
  const id=useWorldStore(state=>state.selectedDistrictBuildingId),mode=useWorldStore(state=>state.cameraMode),name=useWorldStore(state=>state.districtPreviewName);
  const [draft,setDraft]=useState("");const building=districtBuilding(id);
  const heading=useInspectionFocus(mode==="districtBuilding"&&!!building);
  if(mode!=="districtBuilding"||!building)return null;
  return <aside className="profile-drawer profile-drawer--detail crown-panel" aria-label="District building preview" onKeyDown={event=>{if(event.key==="Escape"){event.stopPropagation();useWorldStore.getState().resetWorld();}}}><div className="profile-drawer__body"><div className="profile-drawer__topline"><strong>DEMO INVENTORY</strong><button className="profile-close" aria-label="Close district preview" onClick={()=>useWorldStore.getState().resetWorld()}>×</button></div><h2 ref={heading} tabIndex={-1}>{building.name}</h2><p>{buildingAvailabilityLabel(building.inventory)}</p><label>Explore preview buildings<select aria-label="Preview district building" value={building.id} onChange={event=>useWorldStore.getState().selectDistrictBuilding(event.target.value)}>{districtInventory.filter(b=>b.inventory.kind==="preview").map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label><p className="profile-description">Potential surfaces: {building.surfaces.join(", ")}. Pricing, duration, moderation, fulfillment and booking policies are not activated. This is not legal real estate, an NFT or an investment.</p><form onSubmit={event=>{event.preventDefault();useWorldStore.getState().previewDistrictBuilding(draft);}}><label>Your brand preview<input aria-label="District preview brand" maxLength={48} value={draft} onChange={event=>setDraft(event.target.value)}/></label><button className="profile-share" type="submit">Preview storefront message</button></form>{name?<><p role="status">Unpaid preview: {name}. No booking or transaction.</p><button className="profile-share" onClick={()=>useWorldStore.getState().previewDistrictBuilding("")}>Clear storefront preview</button></>:null}</div></aside>;
}
