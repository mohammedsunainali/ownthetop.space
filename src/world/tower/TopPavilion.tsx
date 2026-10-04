import { BoxGeometry, CanvasTexture, DoubleSide, InstancedMesh, Matrix4, MeshPhysicalMaterial, MeshStandardMaterial, Quaternion, SRGBColorSpace, Vector3, type Group } from "three";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { tokens } from "@/design/tokens";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { worldMaterials } from "@/world/materials/world-materials";
import { getCrownVerticalScale, HELIPAD_LEVEL_OFFSET } from "@/world/tower/tower-layout";

/** Non-ranked tiers continue the paid tower's three-wing plan. */
export const CROWN_TIERS = [
  { base: 0, height: 0.78, reach: [1.04, 0.9, 0.78], width: 0.68 },
  { base: 0.78, height: 0.78, reach: [0.82, 0.67, 0.52], width: 0.54 },
  { base: 1.56, height: 0.82, reach: [0.62, 0.47, 0.34], width: 0.43 },
  { base: 2.38, height: 0.9, reach: [0.43, 0.31, 0.22], width: 0.34 },
] as const;
const crownFrame = new MeshStandardMaterial({ color: tokens.color.brand.lightBlue, metalness: 0.72, roughness: 0.22, emissive: tokens.color.brand.blue, emissiveIntensity: 0.04 });

const skyGlass = new MeshStandardMaterial({ color: tokens.color.brand.lightBlue, transparent: true, opacity: 0.52, metalness: 0.32, roughness: 0.13, depthWrite: false, side: DoubleSide, emissive: tokens.color.brand.blue, emissiveIntensity: 0.08 });
const crownGlass = new MeshStandardMaterial({ color: tokens.color.brand.blue, transparent: true, opacity: 0.68, metalness: 0.48, roughness: 0.14, depthWrite: false, side: DoubleSide, emissive: tokens.color.brand.blue, emissiveIntensity: 0.12 });
const loungeGlass = new MeshPhysicalMaterial({ color: tokens.color.brand.lightBlue, transparent: true, opacity: 0.3, transmission: 0.58, thickness: 0.08, roughness: 0.08, metalness: 0.08, depthWrite: false, side: DoubleSide, emissive: tokens.color.brand.blue, emissiveIntensity: 0.09 });
const unitBox = new BoxGeometry(1, 1, 1);

function CrownEnvelope() {
  const lower = useRef<InstancedMesh>(null);
  const upper = useRef<InstancedMesh>(null);
  const frames = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const lowerMesh = lower.current, upperMesh = upper.current, frameMesh = frames.current;
    if (!lowerMesh || !upperMesh || !frameMesh) return;
    const matrix = new Matrix4(), rotation = new Quaternion(), position = new Vector3(), scale = new Vector3();
    const axis = new Vector3(0, 1, 0);
    let lowerIndex = 0, upperIndex = 0, frameIndex = 0;
    const put = (mesh: InstancedMesh, index: number, angle: number, x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
      rotation.setFromAxisAngle(axis, angle);
      position.set(Math.sin(angle) * z + Math.cos(angle) * x, y, Math.cos(angle) * z - Math.sin(angle) * x);
      scale.set(sx, sy, sz);
      matrix.compose(position, rotation, scale);
      mesh.setMatrixAt(index, matrix);
    };
    CROWN_TIERS.forEach((tier, tierIndex) => tier.reach.forEach((reach, wing) => {
      const angle = wing * Math.PI * 2 / 3;
      put(tierIndex === 3 ? upperMesh : lowerMesh, tierIndex === 3 ? upperIndex++ : lowerIndex++, angle, 0, tier.base + tier.height / 2, reach / 2, tier.width, tier.height * 0.9, reach);
      put(frameMesh, frameIndex++, angle, 0, tier.base + 0.02, reach / 2, tier.width + 0.06, 0.04, reach + 0.06);
      put(frameMesh, frameIndex++, angle, 0, tier.base + tier.height - 0.02, reach / 2, tier.width + 0.04, 0.04, reach + 0.04);
      for (const fraction of [0.25, 0.5, 0.75]) put(frameMesh, frameIndex++, angle, 0, tier.base + tier.height / 2, reach * fraction, tier.width + 0.015, tier.height * 0.9, 0.012);
    }));
    for (const mesh of [lowerMesh, upperMesh, frameMesh]) { mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); }
  }, []);
  return <>
    <instancedMesh ref={lower} args={[unitBox, crownGlass, 9]} />
    <instancedMesh ref={upper} args={[unitBox, skyGlass, 3]} />
    <instancedMesh ref={frames} args={[unitBox, crownFrame, 60]} />
  </>;
}

function Pennant() {
  const flag = useRef<Group>(null);
  const reducedMotion = useReducedMotion();
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024; canvas.height = 256;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = tokens.color.brand.navy; context.fillRect(0, 0, 1024, 256);
      context.fillStyle = tokens.color.brand.white; context.font = "800 82px Inter, system-ui, sans-serif";
      context.textAlign = "center"; context.textBaseline = "middle";
      context.fillText("OwnTheTop.space", 512, 128, 920);
    }
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace;
    return map;
  }, []);
  useFrame(({ clock }) => { if (flag.current && !reducedMotion) flag.current.rotation.y = Math.sin(clock.elapsedTime * 1.4) * 0.035; });
  return <group position={[0.13, 5.13, 0]}>
    <mesh material={worldMaterials.frame} position={[0, 0.17, 0]}><cylinderGeometry args={[0.014, 0.014, 0.52, 6]} /></mesh>
    <group ref={flag} position={[0.7, 0.28, 0]}><mesh><planeGeometry args={[1.38, 0.35, 8, 1]} /><meshBasicMaterial map={texture} side={DoubleSide} /></mesh></group>
  </group>;
}

function SkyCat() {
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => {
    if (!speaking) return;
    const timeout = window.setTimeout(() => setSpeaking(false), 2800);
    return () => window.clearTimeout(timeout);
  }, [speaking]);
  return <group position={[0.12, 2.47, 0.32]} onClick={(event) => { event.stopPropagation(); setSpeaking(true); }}>
    <mesh material={worldMaterials.frame} position={[0, 0.07, 0]}><sphereGeometry args={[0.065, 8, 6]} /></mesh>
    <mesh material={worldMaterials.frame} position={[0, 0.13, 0.025]}><sphereGeometry args={[0.045, 8, 6]} /></mesh>
    {[-1, 1].map((side) => <mesh key={side} material={worldMaterials.frame} position={[side * 0.027, 0.177, 0.026]}><coneGeometry args={[0.018, 0.045, 4]} /></mesh>)}
    <mesh material={worldMaterials.frame} position={[-0.075, 0.1, -0.02]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.01, 0.012, 0.14, 5]} /></mesh>
    {speaking && <Html position={[0, 0.3, 0]} className="cat-easter-egg"><div role="status">Bro! Leave me alone.</div></Html>}
  </group>;
}

function PremiumSkyLounge() {
  const sign = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = 1024; canvas.height = 192;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = tokens.color.brand.navy; context.fillRect(0, 0, 1024, 192);
      context.strokeStyle = tokens.color.brand.summitGold; context.lineWidth = 10; context.strokeRect(5, 5, 1014, 182);
      context.fillStyle = tokens.color.brand.white; context.textAlign = "center"; context.font = "800 66px Inter, system-ui, sans-serif";
      context.fillText("OWN THE TOP FLOOR", 512, 122);
    }
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; return map;
  }, []);
  return <group position={[0, 0.45, 0]}>
    {[0, 2.094, 4.188].map((angle) => <group key={angle} rotation={[0, angle, 0]}>
      <mesh material={loungeGlass} position={[0, 0.12, 0.55]}><boxGeometry args={[0.82, 0.72, 1.12]} /></mesh>
      <mesh material={worldMaterials.podium} position={[0, -0.25, 0.55]}><boxGeometry args={[0.9, 0.07, 1.2]} /></mesh>
      <mesh position={[0, 0.08, 1.125]}><planeGeometry args={[0.78, 0.2]} /><meshBasicMaterial map={sign} side={DoubleSide} toneMapped={false} /></mesh>
      <mesh material={worldMaterials.summit} position={[-0.2, -0.08, 0.62]}><boxGeometry args={[0.28, 0.16, 0.22]} /></mesh>
      <mesh material={worldMaterials.frame} position={[0.14, -0.1, 0.62]}><cylinderGeometry args={[0.09, 0.09, 0.12, 12]} /></mesh>
      <mesh material={worldMaterials.leaf} position={[0.27, 0.05, 0.46]}><icosahedronGeometry args={[0.11, 1]} /></mesh>
      <mesh material={worldMaterials.frame} position={[-0.32, 0.03, 0.42]}><capsuleGeometry args={[0.045, 0.2, 3, 6]} /></mesh>
    </group>)}
  </group>;
}

/** Original integrated crown. y starts above the highest paid floor. */
export function TopPavilion({ y, floorCount }: { y: number; floorCount: number; focused: boolean }) {
  return <group position={[0, y, 0]} scale={[1, getCrownVerticalScale(floorCount), 1]}>
    <CrownEnvelope />
    <PremiumSkyLounge />
    {CROWN_TIERS.map((tier, index) => <group key={tier.base} position={[0, tier.base, 0]}>
      <mesh material={worldMaterials.frame} position={[0, tier.height / 2, 0]} castShadow><cylinderGeometry args={[0.29 - index * 0.04, 0.38 - index * 0.035, tier.height, 6]} /></mesh>
    </group>)}
    {/* The premium lounge sits inside the narrow Y-shaped glass tier. */}
    <group position={[0, 2.52, 0]}>
      <mesh material={worldMaterials.podium}><cylinderGeometry args={[0.22, 0.22, 0.06, 6]} /></mesh>
      <mesh material={worldMaterials.frame} position={[0, 0.16, 0]}><boxGeometry args={[0.18, 0.18, 0.12]} /></mesh>
      {[0, 2.094, 4.188].map((angle) => <group key={angle} rotation={[0, angle, 0]} position={[0, 0, 0.29]}>
        <mesh material={worldMaterials.leaf} position={[0, 0.13, 0]}><icosahedronGeometry args={[0.075, 0]} /></mesh>
      </group>)}
    </group>
    <SkyCat />
    {/* The pad is a braced cantilever off an upper shoulder, below the glass level. */}
    <group position={[0, HELIPAD_LEVEL_OFFSET, 0.9]}>
      <mesh material={worldMaterials.podium} position={[0, -0.08, 0.22]} castShadow><boxGeometry args={[0.98, 0.12, 1.05]} /></mesh>
      <mesh material={worldMaterials.frame} position={[0, -0.21, 0.48]} rotation={[0.38, 0, 0]}><boxGeometry args={[0.4, 0.36, 0.08]} /></mesh>
      <mesh material={worldMaterials.sign} position={[0, -0.005, 0.46]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.42, 24]} /></mesh>
      <mesh material={worldMaterials.summit} position={[0, 0.002, 0.46]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.31, 0.34, 24]} /></mesh>
      <mesh position={[0, 0.008, 0.46]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.22, 0.3]} /><meshBasicMaterial color={tokens.color.brand.white} side={DoubleSide} /></mesh>
    </group>
    <mesh material={crownFrame} position={[0, 3.62, 0]} castShadow><cylinderGeometry args={[0.16, 0.23, 0.68, 6]} /></mesh>
    <mesh material={worldMaterials.crown} position={[0, 4.18, 0]} castShadow><cylinderGeometry args={[0.09, 0.16, 0.52, 8]} /></mesh>
    <mesh material={worldMaterials.frame} position={[0, 5.46, 0]} castShadow><cylinderGeometry args={[0.006, 0.09, 2.05, 8]} /></mesh>
    <Pennant />
  </group>;
}
