import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { PMREMGenerator } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/** Original neutral studio illumination; one tiny prefiltered cube, no network HDRI or per-frame work. */
export function StudioReflections({ mobile, night }: { mobile: boolean; night: boolean }) {
  const get = useThree(state => state.get);
  useEffect(() => {
    if (mobile) return;
    const { gl, scene } = get();
    const started = performance.now();
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, 0.04, 0.1, 100, { size: 64 });
    const previous = scene.environment;
    scene.environment = environment.texture;
    room.dispose();
    generator.dispose();
    if (new URLSearchParams(window.location.search).get("diagnostics") === "1") gl.domElement.dataset.ottReflectionBakeMs = String(performance.now() - started);
    return () => { scene.environment = previous; environment.dispose(); };
  }, [get, mobile]);
  useEffect(() => {
    const { scene } = get();
    const previous = scene.environmentIntensity;
    scene.environmentIntensity = night ? 0.16 : 0.28;
    return () => { scene.environmentIntensity = previous; };
  }, [get, night]);
  return null;
}
