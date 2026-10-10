"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
export function reducedMotionFixture(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.get("diagnostics") === "1" && params.get("reducedMotion") === "1";
}
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches || reducedMotionFixture(window.location.search), () => false);
}
