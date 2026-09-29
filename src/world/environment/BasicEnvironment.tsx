import { useWorldStore } from "@/state/world-store";

export function BasicEnvironment() {
  const worldTime = useWorldStore((state) => state.worldTime);
  const night = worldTime === "night";

  return (
    <>
      <color attach="background" args={[night ? "#0d1930" : "#dff1ff"]} />
      <fog attach="fog" args={[night ? "#0d1930" : "#dff1ff", 24, 58]} />
      <ambientLight intensity={night ? 0.46 : 0.9} />
      <directionalLight position={[10, 18, 12]} intensity={night ? 1.2 : 2.3} color={night ? "#8eb8ff" : "#fff8e8"} castShadow />
      <hemisphereLight args={[night ? "#273e75" : "#d8efff", night ? "#08101f" : "#afc9cf", night ? 0.42 : 1.15]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.02, 0]}>
        <circleGeometry args={[25, 64]} />
        <meshStandardMaterial color={night ? "#15253b" : "#ecf4f5"} roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <circleGeometry args={[45, 64]} />
        <meshStandardMaterial color={night ? "#071b29" : "#9ed9ed"} roughness={0.28} metalness={0.16} />
      </mesh>
    </>
  );
}
