"use client";

import Image from "next/image";
import { ClaimPanel } from "@/components/shell/ClaimPanel";
import { CreateFloorDialog } from "@/components/shell/CreateFloorDialog";
import { MetricsPanel } from "@/components/shell/MetricsPanel";
import { WorldControls } from "@/components/controls/WorldControls";
import { ProfileDrawer } from "@/components/profile/ProfileDrawer";
import { WorldCanvas } from "@/world/WorldCanvas";
import { useWorldStore } from "@/state/world-store";

export function AppShell() {
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const hudRevealed = useWorldStore((state) => state.hudRevealed);
  const revealHud = useWorldStore((state) => state.revealHud);
  const preview = useWorldStore((state) => state.floorPreview);
  const clearPreview = useWorldStore((state) => state.clearFloorPreview);
  const focused = cameraMode !== "overview";
  return (
    <main className={`app-shell${focused && !hudRevealed ? " app-shell--focus" : ""}`}>
      <section className="world-section" id="top" aria-label="OwnTheTop skyline">
        <WorldCanvas />
        <header className="site-header">
          <a className="brand" href="#top" aria-label="OwnTheTop home"><Image className="brand-logo" src="/brand/ownthetop-logo-primary.svg" alt="OwnTheTop" width={1400} height={300} priority /></a>
          <p>Claim your space. Own the top.</p>
          <span className="phase-badge">Interactive skyline · demo</span>
        </header>
        <div className="world-hero"><ClaimPanel /></div>
        {focused && !hudRevealed ? <button type="button" className="hud-reveal" onClick={revealHud}>Show claim controls</button> : null}
        <MetricsPanel />
        <WorldControls />
        <ProfileDrawer />
        {preview ? <aside className="floor-preview-status" aria-label="Floor preview status"><strong>PREVIEW MODE</strong><span>This is how your floor could look. No payment has been made.</span><button type="button" onClick={clearPreview}>Close preview</button></aside> : null}
        <CreateFloorDialog />
        <div className="world-caption"><span>Drag to orbit</span><span>Scroll to zoom</span><span>Click a floor to inspect</span></div>
      </section>
    </main>
  );
}
