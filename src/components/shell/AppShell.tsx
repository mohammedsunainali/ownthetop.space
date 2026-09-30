"use client";

import Image from "next/image";
import { ClaimPanel } from "@/components/shell/ClaimPanel";
import { MetricsPanel } from "@/components/shell/MetricsPanel";
import { WorldControls } from "@/components/controls/WorldControls";
import { ProfileDrawer } from "@/components/profile/ProfileDrawer";
import { WorldCanvas } from "@/world/WorldCanvas";

export function AppShell() {
  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="OwnTheTop home"><Image className="brand-logo" src="/brand/ownthetop-logo-primary.svg" alt="OwnTheTop" width={1400} height={300} priority /></a>
        <p>Claim your space. Own the top.</p>
        <span className="phase-badge">Phase 2 · world preview</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <Image className="hero-mascot" src="/brand/ownthetop-mascot-flat.svg" alt="OwnTheTop mascot" width={76} height={76} />
          <span className="eyebrow">A competitive 3D skyline</span>
          <h1>Who owns<br />the top?</h1>
          <p>One listing, one floor. Cumulative support decides how high it rises.</p>
        </div>
        <ClaimPanel />
      </section>

      <section className="world-section" aria-label="OwnTheTop skyline">
        <WorldCanvas />
        <MetricsPanel />
        <WorldControls />
        <ProfileDrawer />
        <div className="world-caption"><span>Drag to orbit</span><span>Scroll to zoom</span><span>Click a floor to inspect</span></div>
      </section>
    </main>
  );
}
