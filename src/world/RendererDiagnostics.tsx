import { useFrame, useThree } from "@react-three/fiber";
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
  const get = useThree(state => state.get);
  useEffect(() => {
    const { gl } = get();
    const original = gl.render;
    let count = 0;
    const measured: typeof gl.render = function(scene, camera) {
      const start = performance.now();
      try { return original.call(gl, scene, camera); } finally {
        if (count++ < 30) recordNavigationSample("initialRenderCpuMs", performance.now() - start);
      }
    };
    gl.render = measured;
    return () => { if (gl.render === measured) gl.render = original; };
  }, [get]);
  const frame = useRef({ count: 0, seconds: 0, times: [] as number[] });
  useEffect(() => {
    if (typeof PerformanceObserver === "undefined" || !PerformanceObserver.supportedEntryTypes.includes("longtask")) return;
    const observer = new PerformanceObserver(list => list.getEntries().forEach(entry => recordNavigationSample("longTaskMs", entry.duration)));
    observer.observe({ type: "longtask", buffered: true });
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
      heapUsedBytes: (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ?? null,
      loading: performance.getEntriesByType("navigation").map(entry => {
        const timing = entry as PerformanceNavigationTiming;
        return { domInteractiveMs: timing.domInteractive, loadEndMs: timing.loadEventEnd };
      }),
      resourceTransferBytes: performance.getEntriesByType("resource").reduce((sum, entry) => sum + (entry as PerformanceResourceTiming).transferSize, 0),
      reflectionBakeMs: Number(gl.domElement.dataset.ottReflectionBakeMs) || null,
    };
    window.__OWNTHTOP_PERF__ = snapshot;
    gl.domElement.dataset.ottPerf = JSON.stringify(snapshot);
    frame.current.count = 0;
    frame.current.seconds = 0;
    frame.current.times.length = 0;
  });
  return null;
}
