"use client";

import Image from "next/image";
import { FloorInspection } from "./FloorInspection";
import { useMemo, useState, useSyncExternalStore, useRef, useEffect } from "react";
import { floorShareUrl } from "@/domain/floor-share";
import { formatMinorUnits } from "@/domain/money";
import { allListings, regressionListings } from "@/mock";
import { createStressListings } from "@/mock/stress-floors";
import { useWorldStore } from "@/state/world-store";
import { initialsForName, isSafeLogoUrl } from "@/world/tower/floor-signs";
import {currentStressFixture} from "@/mock/fixture-mode";

export function ProfileDrawer() {
  const previousFocus = useRef<HTMLElement|null>(null);
  const [inspectionId,setInspectionId]=useState<string|null>(null);
  const [shared, setShared] = useState<{ id: string; url: string; copied: boolean } | null>(null);
  const selectedListingId = useWorldStore((state) => state.selectedListingId);
  const profileVisible = useWorldStore((state) => state.profileVisible);
  const fixture = useSyncExternalStore(()=>()=>{},()=>currentStressFixture()?"stress":new URLSearchParams(window.location.search).get("regression")==="legacy"?"legacy":"demo",()=>"demo");
  const inventory=useMemo(()=>fixture==="stress"?createStressListings():fixture==="legacy"?regressionListings:allListings,[fixture]);
  const selected = inventory.find((listing) => listing.id === selectedListingId);

  useEffect(()=>{
    if (!selectedListingId || !profileVisible) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return ()=>{
      const target=previousFocus.current;
      if (target?.isConnected && getComputedStyle(target).visibility!=="hidden" && getComputedStyle(target).display!=="none") target.focus({preventScroll:true});
      if (!target || document.activeElement!==target) document.querySelector<HTMLElement>(".world-canvas")?.focus({preventScroll:true});
    };
  },[selectedListingId,profileVisible]);

  if(selected && !profileVisible)return null;
  if (!selected) {
    return (
      <aside className="profile-drawer profile-drawer--empty" aria-live="polite">
        <Image src="/brand/ownthetop-mascot-flat.svg" alt="" width={54} height={54} />
        <span className="eyebrow">Floor profile</span>
        <strong>Select a lit floor</strong>
        <p>Each claimed listing occupies exactly one floor.</p>
      </aside>
    );
  }

  const listedDate = Number.isNaN(Date.parse(selected.claimedAt)) ? null : new Date(selected.claimedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const safeLogo = selected.logoUrl && isSafeLogoUrl(selected.logoUrl) ? selected.logoUrl : null;
  const amount = formatMinorUnits(selected.totalPaidMinor, selected.currency);

  return (
    <aside className={`profile-drawer profile-drawer--detail${selected.hiring ? " profile-drawer--hiring" : ""}`} aria-live="polite" aria-label={`${selected.name} floor profile`} onKeyDown={event=>{if(event.key==="Escape" && !inspectionId){event.stopPropagation();useWorldStore.getState().closeProfile();}}}>
      {selected.hiring ? <div className="profile-hiring">HIRING ACTIVELY</div> : null}
      <button className="profile-close profile-close--floor" type="button" aria-label="Close profile" onClick={() => useWorldStore.getState().closeProfile()}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <div className="profile-drawer__body">
      <div className="profile-drawer__topline">
        <div className="profile-mark" aria-hidden="true">{safeLogo ? <Image src={safeLogo} alt="" width={72} height={72} unoptimized /> : initialsForName(selected.name)}</div>
        <span className="profile-rank">Rank #{selected.rank}</span>
      </div>
      <h2>{selected.name}</h2>
      <p className="profile-price">{selected.hiring ? `Claimed floor at ${amount}` : `${amount} cumulative`}</p>
      <div className="profile-tags">
        <span>{selected.category}</span>
        {selected.location ? <span>{selected.location}</span> : null}
      </div>
      {selected.description ? <p className="profile-description">{selected.description}</p> : null}
      <a className="profile-url" href={selected.url} target="_blank" rel="noopener noreferrer">Visit website ↗</a>
      <button className="profile-inspect" type="button" onClick={()=>setInspectionId(selected.id)}>Read & inspect floor ↗</button>
      {inspectionId === selected.id && <FloorInspection key={selected.id} listing={selected} onClose={()=>setInspectionId(null)}/>}
      <button className="profile-share" type="button" onClick={async () => {
        const url = floorShareUrl(window.location.href, selected);
        try { await navigator.clipboard.writeText(url); setShared({ id: selected.id, url, copied: true }); }
        catch { setShared({ id: selected.id, url, copied: false }); }
      }}>Copy floor link</button>
      {shared?.id === selected.id && (shared.copied ? <p role="status">Floor link copied. This is a synthetic demo listing.</p> : <label>Floor link<input aria-label="Shareable floor link" readOnly value={shared.url} /></label>)}
      <dl className="profile-details">
        <div><dt>Category</dt><dd>{selected.category}</dd></div>
        {selected.location ? <div><dt>Location</dt><dd>{selected.location}</dd></div> : null}
        {listedDate ? <div><dt>Listed</dt><dd>{listedDate}</dd></div> : null}
        {selected.description ? <div><dt>About</dt><dd>{selected.description}</dd></div> : null}
      </dl>
      </div>
    </aside>
  );
}
