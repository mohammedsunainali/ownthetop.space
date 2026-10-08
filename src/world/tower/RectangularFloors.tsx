import { useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Color, InstancedMesh, Matrix4 } from "three";
import type { Listing } from "@/domain/listing";
import type { TowerVisualConfig } from "@/world/types";
import { tokens } from "@/design/tokens";
import { useWorldStore } from "@/state/world-store";
import { getFloorY } from "@/world/tower/tower-layout";
import { visibleFloorSigns } from "@/world/tower/floor-signs";
import { RectangularAdvertisementPair } from "@/world/tower/RectangularAdvertisement";
import { RECTANGULAR_TOWER as building } from "@/world/tower/rectangular-layout";
import { worldMaterials } from "@/world/materials/world-materials";

const bodyGeometry = new BoxGeometry(building.width, building.floorHeight, building.depth);
const slabGeometry = new BoxGeometry(building.width + 0.24, building.slabHeight, building.depth + 0.24);
const windowGeometry = new BoxGeometry(0.02,0.8,0.55);

export function RectangularFloors({listings,accent,selectedListingId,focused,focusedRank,exploded,onSelect}:{listings:readonly Listing[];accent:TowerVisualConfig["accent"];selectedListingId:string|null;focused:boolean;focusedRank?:number;exploded:boolean;onSelect:(listing:Listing)=>void}) {
  const body=useRef<InstancedMesh>(null), slabs=useRef<InstancedMesh>(null);
  const windows=useRef<InstancedMesh>(null);
  const preview=useWorldStore(state=>state.floorPreview);
  const activePreview=focused && preview?.towerId===listings[0]?.towerId ? preview.media : null;
  const signs=useMemo(()=>visibleFloorSigns(listings,selectedListingId,focused,focusedRank).filter(item=>item.rank!==activePreview?.rank),[listings,selectedListingId,focused,focusedRank,activePreview]);
  const elevation=(rank:number)=>getFloorY(rank,listings.length)+(exploded?(listings.length-rank)*0.12:0);
  useLayoutEffect(()=>{
    if(!body.current || !slabs.current)return;
    const matrix=new Matrix4();
    listings.forEach((listing,index)=>{
      const y=getFloorY(listing.rank,listings.length)+(exploded?(listings.length-listing.rank)*0.12:0);
      body.current!.setMatrixAt(index,matrix.makeTranslation(0,y,0));
      slabs.current!.setMatrixAt(index,matrix.makeTranslation(0,y+building.pitch/2,0));
      slabs.current!.setColorAt(index,new Color(listing.id===selectedListingId?tokens.color.brand.blue:listing.rank===1?tokens.color.brand.summitGold:tokens.color.brand[accent]));
      for(let side=0;side<2;side++)for(let pane=0;pane<3;pane++)windows.current?.setMatrixAt(index*6+side*3+pane,matrix.makeTranslation(side?3.435:-3.435,y,(pane-1)*1.15));
    });
    body.current.instanceMatrix.needsUpdate=true;slabs.current.instanceMatrix.needsUpdate=true;
    if(slabs.current.instanceColor)slabs.current.instanceColor.needsUpdate=true;
    body.current.computeBoundingSphere();slabs.current.computeBoundingSphere();
    if(windows.current){windows.current.instanceMatrix.needsUpdate=true;windows.current.computeBoundingSphere();}
  },[listings,exploded,selectedListingId,accent]);
  return <group>
    <instancedMesh ref={body} args={[bodyGeometry,worldMaterials.rectangularGlass,listings.length]} castShadow receiveShadow onClick={event=>{event.stopPropagation();const listing=listings[event.instanceId??-1];if(listing)onSelect(listing);}} onPointerOver={event=>{(event.nativeEvent.target as HTMLElement).closest(".world-canvas")?.setAttribute("data-interactive","true");}} onPointerOut={event=>{(event.nativeEvent.target as HTMLElement).closest(".world-canvas")?.removeAttribute("data-interactive");}} />
    <instancedMesh ref={slabs} args={[slabGeometry,worldMaterials.facade,listings.length]} castShadow receiveShadow />
    <instancedMesh ref={windows} args={[windowGeometry,worldMaterials.windowLight,listings.length*6]} />
    {[...listings.filter(item=>item.rank!==activePreview?.rank),...(activePreview?[activePreview]:[])].map(listing=><group key={listing.id} position={[0,elevation(listing.rank),0]} onClick={event=>{event.stopPropagation();const current=listings.find(item=>item.id===listing.id);if(current)onSelect(current);}}>
      <RectangularAdvertisementPair listing={listing} detailed={signs.some(item=>item.id===listing.id)||listing===activePreview}/>
    </group>)}
  </group>;
}
