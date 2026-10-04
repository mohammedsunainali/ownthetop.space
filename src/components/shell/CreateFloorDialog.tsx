"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { towers } from "@/mock/towers";
import { listingsByTower } from "@/mock";
import { useWorldStore } from "@/state/world-store";

const MAX_LOGO_BYTES = 3 * 1024 * 1024;
const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function validateFloorContent(name: string, subtitle: string): string | null {
  if (name.trim().length < 2 || name.trim().length > 60) return "Display name must be 2–60 characters.";
  if (subtitle.trim().length < 3 || subtitle.trim().length > 100) return "Subtitle must be 3–100 characters.";
  return null;
}

export function CreateFloorDialog() {
  const draft = useWorldStore((state) => state.claimDraft);
  const close = useWorldStore((state) => state.closeClaimDraft);
  const showPreview = useWorldStore((state) => state.showFloorPreview);
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [hiring, setHiring] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!draft) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.querySelector<HTMLElement>("input[type=file]")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = [...dialogRef.current.querySelectorAll<HTMLElement>("input:not([disabled]), button:not([disabled])")];
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); previousFocus?.focus(); };
  }, [close, draft]);

  if (!draft) return null;
  const towerName = towers.find((tower) => tower.id === draft.towerId)?.name ?? "Companies";
  const readLogo = (file?: File) => {
    if (!file) return;
    if (!LOGO_TYPES.includes(file.type)) { setError("Choose a PNG, JPEG, or WebP image."); return; }
    if (file.size > MAX_LOGO_BYTES) { setError("Logo must be 3 MB or smaller."); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") { setLogoUrl(reader.result); setLogoName(file.name); setError(null); } };
    reader.onerror = () => setError("The logo could not be read.");
    reader.readAsDataURL(file);
  };
  const preview = () => {
    const validation = validateFloorContent(name, subtitle);
    if (validation) { setError(validation); return; }
    const count = listingsByTower[draft.towerId].length;
    showPreview({
      towerId: draft.towerId, category: draft.category, url: draft.url,
      media: { id: "temporary-floor-preview", name: name.trim(), description: subtitle.trim(), logoUrl, hiring, rank: Math.min(draft.estimatedRank, count), totalPaidMinor: draft.amountMinor },
    });
  };
  return <div className="create-floor-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
    <div ref={dialogRef} className="create-floor-dialog" role="dialog" aria-modal="true" aria-labelledby="create-floor-title" aria-describedby="create-floor-description">
      <div className="create-floor-heading">
        <div><span className="eyebrow">Phase 2 preview</span><h2 id="create-floor-title">CREATE YOUR FLOOR</h2><p id="create-floor-description">Make your spot in the skyline yours.</p></div>
        <button type="button" className="create-floor-close" aria-label="Close Create Your Floor" onClick={close}>×</button>
      </div>
      <label className="create-floor-upload">
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" aria-label="Upload logo" onChange={(event) => readLogo(event.target.files?.[0])} />
        <span className="create-floor-logo">{logoUrl ? <Image src={logoUrl} alt="Selected logo preview" width={64} height={64} unoptimized /> : name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "LOGO"}</span>
        <span><strong>{logoName || "Upload a logo"}</strong><small>PNG, JPEG or WebP · up to 3 MB · optional</small></span>
      </label>
      <label className="create-floor-field">Display name<input value={name} maxLength={60} onChange={(event) => { setName(event.target.value); setError(null); }} placeholder="Northstar Foundry" required /></label>
      <label className="create-floor-field">Subtitle<input value={subtitle} maxLength={100} onChange={(event) => { setSubtitle(event.target.value); setError(null); }} placeholder="A short phrase for your floor" required /></label>
      <label className="create-floor-hiring"><input type="checkbox" checked={hiring} onChange={(event) => setHiring(event.target.checked)} /> We’re hiring</label>
      <div className="create-floor-summary"><span><small>Website / profile</small><strong>{draft.url}</strong></span><span><small>Tower</small><strong>{towerName}</strong></span><span><small>Category</small><strong>{draft.category}</strong></span></div>
      {error ? <p className="create-floor-error" role="alert">{error}</p> : null}
      <p className="create-floor-note">Preview only. No payment has been made and no floor has been claimed.</p>
      <div className="create-floor-actions"><button type="button" onClick={close}>Back</button><button type="button" className="primary-button" onClick={preview}>PREVIEW MY FLOOR</button></div>
    </div>
  </div>;
}
