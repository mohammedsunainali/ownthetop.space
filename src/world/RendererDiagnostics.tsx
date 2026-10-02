import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

declare global {
  interface Window {
    __OWNTHTOP_PERF__?: { fps: number; calls: number; triangles: number; geometries: number; textures: number; samples: number };
  }
}

/** Development-only sampling; no visible panel and no React state writes per frame. */
export function RendererDiagnostics() {
  const frame = useRef({ count: 0, seconds: 0 });
  useFrame(({ gl }, delta) => {
    frame.current.count++;
    frame.current.seconds += delta;
    if (frame.current.seconds < 2) return;
    const snapshot = {
      fps: Math.round(frame.current.count / frame.current.seconds),
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
      samples: frame.current.count,
    };
    window.__OWNTHTOP_PERF__ = snapshot;
    gl.domElement.dataset.ottPerf = JSON.stringify(snapshot);
    frame.current.count = 0;
    frame.current.seconds = 0;
  });
  return null;
}
