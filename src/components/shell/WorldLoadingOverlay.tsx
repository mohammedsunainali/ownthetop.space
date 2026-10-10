"use client";

import Image from "next/image";
import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function WorldLoadingOverlay({ sceneReady, onComplete }: { sceneReady: boolean; onComplete: () => void }) {
  const { active, loaded, total, progress } = useProgress();
  const reducedMotion = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (!sceneReady || active || (total > 0 && loaded < total)) return;
    const reveal = window.setTimeout(() => setLeaving(true), reducedMotion ? 0 : 280);
    const finish = window.setTimeout(onComplete, reducedMotion ? 20 : 700);
    return () => { window.clearTimeout(reveal); window.clearTimeout(finish); };
  }, [sceneReady, active, loaded, total, reducedMotion, onComplete]);
  const value = sceneReady && !active && (total === 0 || loaded >= total) ? 100 : Math.max(0, Math.min(99, Math.round(progress)));
  return <div className={`world-loading${leaving ? " world-loading--leaving" : ""}`} role="status" aria-label="Loading OwnTheTop skyline" aria-live="polite">
    <div className="world-loading__content">
      <div className="world-loading__logo"><Image src="/brand/ownthetop-logo-primary.svg" alt="OwnTheTop" fill sizes="270px" priority /></div>
      <p className="world-loading__eyebrow">THE SKYLINE IS RISING</p>
      <h2>Your competition is climbing.<br />Where&apos;s your floor?</h2>
      <div className="world-loading__track" role="progressbar" aria-label="World assets loaded" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><span style={{ width: `${value}%` }} /></div>
      <p className="world-loading__status">{value === 100 ? "The district is ready." : "Raising the skyline…"}</p>
    </div>
  </div>;
}
