"use client";

import { useEffect, useRef, useState } from "react";
import type { Listing } from "@/domain/listing";
import { formatMinorUnits } from "@/domain/money";
import { activateRectangularTexture, createRectangularTexture } from "@/world/tower/rectangular-signs";
import { getHiringSignMaterial } from "@/world/tower/floor-signs";
import { RECTANGULAR_AD } from "@/world/tower/rectangular-layout";

/** Native modal provides readable text and magnifies the original frozen canvas artwork. */
export function FloorInspection({listing,onClose}:{listing:Listing;onClose:()=>void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const artwork = useRef<HTMLDivElement>(null);
  const [magnified,setMagnified]=useState(false);
  useEffect(()=>{
    const previous=document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const node=dialog.current;
    node?.showModal();
    return ()=>{node?.close();previous?.focus();};
  },[]);
  useEffect(()=>{
    const media=createRectangularTexture(listing), logo=createRectangularTexture(listing,true);
    activateRectangularTexture(media); activateRectangularTexture(logo);
    const surface=media.image as HTMLCanvasElement, logoSurface=logo.image as HTMLCanvasElement;
    surface.className="floor-inspection__media"; surface.setAttribute("aria-label",`${listing.name} original floor advertisement`);
    logoSurface.className="floor-inspection__logo"; logoSurface.setAttribute("aria-label",`${listing.name} logo`);
    artwork.current?.replaceChildren(surface,logoSurface);
    if(listing.hiring){
      const slate=document.createElement("canvas"); slate.width=512; slate.height=152;
      const image=getHiringSignMaterial().map?.image as HTMLCanvasElement | undefined;
      if(image)slate.getContext("2d")?.drawImage(image,0,0,512,152);
      const sign=RECTANGULAR_AD.hiring;
      slate.className="floor-inspection__hiring"; slate.setAttribute("aria-label","HIRING");
      Object.assign(slate.style,{left:`${((sign.x+3.2-sign.width/2)/6.4)*100}%`,top:`${((.6-sign.y-sign.height/2)/1.2)*100}%`,width:`${sign.width/6.4*100}%`,height:`${sign.height/1.2*100}%`});
      artwork.current?.append(slate);
    }
    return ()=>{media.dispose();logo.dispose();};
  },[listing]);
  return <dialog ref={dialog} className="floor-inspection" aria-labelledby="floor-inspection-title" onCancel={onClose} onClose={onClose}>
    <header><span className="eyebrow">Floor #{listing.rank} · close inspection</span><button type="button" aria-label="Close floor inspection" onClick={onClose}>×</button></header>
    <h2 id="floor-inspection-title">{listing.name}</h2>
    <p className="floor-inspection__description">{listing.description}</p>
    <p><strong>{formatMinorUnits(listing.totalPaidMinor,listing.currency)}</strong>{listing.hiring ? " · HIRING" : ""}</p>
    <button type="button" className="floor-inspection__zoom" aria-pressed={magnified} onClick={()=>setMagnified(value=>!value)}>{magnified ? "Fit artwork" : "Magnify original artwork"}</button>
    <div className="floor-inspection__scroll" tabIndex={0} aria-label="Original billboard artwork; scroll horizontally when magnified"><div ref={artwork} className={`floor-inspection__art${magnified ? " floor-inspection__art--magnified" : ""}`}/></div>
    <p className="floor-inspection__hint">The text above is a readable transcript. Magnified artwork can be scrolled horizontally. Synthetic demo listing.</p>
  </dialog>;
}
