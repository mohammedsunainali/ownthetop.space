"use client";

import { ClaimPanel } from "@/components/shell/ClaimPanel";
import { MetricsPanel } from "@/components/shell/MetricsPanel";
import { WorldControls } from "@/components/controls/WorldControls";
import { ProfileDrawer } from "@/components/profile/ProfileDrawer";
import { WorldCanvas } from "@/world/WorldCanvas";

export function AppShell() {
  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="OwnTheTop home"><span>Own</span>TheTop</a>
        <p>Claim your space. Own the top.</p>
        <span className="phase-badge">Phase 1 · live mock world</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
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
