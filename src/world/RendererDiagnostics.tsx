import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { navigationSnapshot, recordNavigationSample } from "./navigation-performance";
import { frameStatistics } from "./frame-statistics";

declare global {
  interface Window {
    __OWNTHTOP_PERF__?: { fps: number; calls: number; triangles: number; geometries: number; textures: number; samples: number };
  }
}

/** Explicit diagnostics-only sampling; no visible panel or per-frame React state writes. */
export function RendererDiagnostics() {
  const frame = useRef({ count: 0, seconds: 0, times: [] as number[] });
  useEffect(() => {
    if (typeof PerformanceObserver === "undefined" || !PerformanceObserver.supportedEntryTypes.includes("longtask")) return;
    const observer = new PerformanceObserver(list => list.getEntries().forEach(entry => recordNavigationSample("longTaskMs", entry.duration)));
    observer.observe({ type: "longtask" });
    return () => observer.disconnect();
  }, []);
  useFrame(({ gl }, delta) => {
    frame.current.count++;
    frame.current.seconds += delta;
    if (frame.current.times.length < 1024) frame.current.times.push(delta * 1000);
    if (frame.current.seconds < 2) return;
    const snapshot = {
      fps: Math.round(frame.current.count / frame.current.seconds),
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
      samples: frame.current.count,
      ...frameStatistics(frame.current.times),
      documentHidden: document.hidden,
      dpr: gl.getPixelRatio(),
      navigation: navigationSnapshot(),
    };
    window.__OWNTHTOP_PERF__ = snapshot;
    gl.domElement.dataset.ottPerf = JSON.stringify(snapshot);
    frame.current.count = 0;
    frame.current.seconds = 0;
    frame.current.times.length = 0;
  });
  return null;
}
