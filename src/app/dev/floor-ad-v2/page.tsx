"use client";

import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { CanvasTexture, Color, DoubleSide, MeshStandardMaterial, SRGBColorSpace } from "three";
import { companies } from "@/mock/companies";
import type { Listing } from "@/domain/listing";
import { formatMinorUnits } from "@/domain/money";
import { fitText, initialsForName } from "@/world/tower/floor-signs";
import { floorFrontGlazingGeometry, floorSideGlazingGeometry, floorWingGeometry } from "@/world/tower/Floor";
import { FLOOR_HEIGHT, FLOOR_PITCH, getFloorFootprint } from "@/world/tower/tower-layout";
import { worldMaterials } from "@/world/materials/world-materials";

const FLOOR_AD_V2 = {
  facadeWidthRatio: 0.92,
  facadeHeightRatio: 0.76,
  horizontalInsetRatio: 0.04,
  logoHeightRatio: 0.44,
  logoInternalPaddingRatio: 0.18,
  statsWidthRatio: 0.19,
  surfaceOffset: 0.010,
  logoAdditionalDepth: 0.014,
  selectionEdgeThickness: 0.014,
  textureWidth: 1536,
  textureHeight: 384,
} as const;

const normal: Listing = { ...companies[14], hiring: false };
const hiring: Listing = {
  ...companies[13], id: "fixture-designless", name: "Designless", rank: 14,
  totalPaidMinor: 5000, hiring: true, logoUrl: null,
  description: "We are building the Design Factory for the enterprise.",
  category: "Design & Creative", location: "Remote",
};
const summit: Listing = companies[0];
const cases = { normal, hiring, summit } as const;
type Case = keyof typeof cases;
const integratedGlass = new MeshStandardMaterial({ color: "#0a3471", roughness: .34, metalness: .2, emissive: "#082e68", emissiveIntensity: .05 });

function texture(draw: (context: CanvasRenderingContext2D) => void, width: number = FLOOR_AD_V2.textureWidth, height: number = FLOOR_AD_V2.textureHeight) {
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext("2d");
  if (context) draw(context);
  const result = new CanvasTexture(canvas);
  result.colorSpace = SRGBColorSpace;
  result.anisotropy = 8;
  return result;
}

function createPrimaryTexture(listing: Listing) {
  return texture((ctx) => {
    const w = FLOOR_AD_V2.textureWidth, h = FLOOR_AD_V2.textureHeight;
    ctx.fillStyle = "#08295b"; ctx.fillRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "rgba(39,119,216,.22)"); grad.addColorStop(.55, "rgba(6,39,93,0)"); grad.addColorStop(1, "rgba(2,21,54,.24)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    const pad = w * .04;
    const contentX = w * .32;
    const statsX = w * (1 - .04 - FLOOR_AD_V2.statsWidthRatio);
    const contentWidth = statsX - contentX - w * .025;
    ctx.textBaseline = "middle";
    const name = fitText(ctx, listing.name, contentWidth, 89, 57);
    ctx.fillStyle = "#f7fbff"; ctx.font = `800 ${name.size}px Inter, system-ui, sans-serif`;
    ctx.fillText(name.text, contentX, listing.hiring ? 137 : 156);
    const detail = fitText(ctx, listing.description, contentWidth, 43, 28, 500);
    ctx.fillStyle = "#b7d5f4"; ctx.font = `500 ${detail.size}px Inter, system-ui, sans-serif`;
    ctx.fillText(detail.text, contentX, listing.hiring ? 217 : 227);
    if (listing.hiring) {
      ctx.fillStyle = "#12d593"; ctx.beginPath(); ctx.roundRect(contentX, 266, 151, 48, 10); ctx.fill();
      ctx.fillStyle = "#052c36"; ctx.font = "800 27px Inter, system-ui, sans-serif";
      ctx.fillText("HIRING", contentX + 21, 291);
    }
    ctx.textAlign = "right";
    ctx.fillStyle = listing.rank === 1 ? "#ffcf6a" : "#ffffff";
    ctx.font = "800 76px Inter, system-ui, sans-serif";
    ctx.fillText(`#${listing.rank}`, w - pad, 149);
    const amount = fitText(ctx, formatMinorUnits(listing.totalPaidMinor), w * FLOOR_AD_V2.statsWidthRatio, 80, 58);
    ctx.font = `800 ${amount.size}px Inter, system-ui, sans-serif`;
    ctx.fillText(amount.text, w - pad, 239);
    ctx.fillStyle = listing.rank === 1 ? "#ffcf6a" : "#4c9df4";
    ctx.fillRect(pad, h - 9, w - pad * 2, 4);
  });
}

function createBrandTexture(listing: Listing) {
  return texture((ctx) => {
    ctx.fillStyle = "#08295b"; ctx.fillRect(0, 0, 768, 384);
    ctx.fillStyle = "rgba(38,113,209,.18)"; ctx.fillRect(0, 0, 768, 384);
    const label = fitText(ctx, listing.name, 550, 59, 39);
    ctx.fillStyle = "#f5fbff"; ctx.font = `800 ${label.size}px Inter, system-ui, sans-serif`;
    ctx.textBaseline = "middle"; ctx.fillText(label.text, 145, 195);
  }, 768, 384);
}

function createPlaqueTexture(listing: Listing) {
  return texture((ctx) => {
    ctx.fillStyle = "#f8fbff"; ctx.beginPath(); ctx.roundRect(0, 0, 256, 256, 42); ctx.fill();
    ctx.fillStyle = "#0a244e"; ctx.font = "800 112px Inter, system-ui, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(initialsForName(listing.name), 128, 132, 256 * (1 - 2 * FLOOR_AD_V2.logoInternalPaddingRatio));
  }, 256, 256);
}

function WingStructure({ footprint, wing, y = 0, active = false }: { footprint: number; wing: number; y?: number; active?: boolean }) {
  const angle = wing * Math.PI * 2 / 3;
  return <group position={[0, y, 0]} rotation={[0, angle, 0]}>
    <mesh geometry={floorWingGeometry} material={worldMaterials.floor.blue} position={[0, 0, 1.27 * footprint]} scale={[footprint, 1, footprint]} />
    <mesh geometry={floorFrontGlazingGeometry} material={active ? integratedGlass : worldMaterials.glazing} position={[0, 0, 2.43 * footprint]} scale={[footprint, 1, 1]} />
    {[-1, 1].map((side) => <mesh key={side} geometry={floorSideGlazingGeometry} material={active ? integratedGlass : worldMaterials.sideGlazing} position={[side * .73 * footprint, 0, 1.27 * footprint]} scale={[1, 1, footprint]} />)}
  </group>;
}

function FloorBand({ listing, selected, onSelect }: { listing: Listing; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const footprint = getFloorFootprint(listing.rank, 50);
  const primary = useMemo(() => createPrimaryTexture(listing), [listing]);
  const brand = useMemo(() => createBrandTexture(listing), [listing]);
  const plaqueTexture = useMemo(() => createPlaqueTexture(listing), [listing]);
  useEffect(() => () => { primary.dispose(); brand.dispose(); plaqueTexture.dispose(); }, [primary, brand, plaqueTexture]);
  const clearHeight = FLOOR_HEIGHT * .84;
  const height = clearHeight * FLOOR_AD_V2.facadeHeightRatio;
  const frontWidth = floorFrontGlazingGeometry.parameters.width * footprint * FLOOR_AD_V2.facadeWidthRatio;
  const sideUsable = (2.25 - 1.12) * footprint;
  const sideWidth = sideUsable * FLOOR_AD_V2.facadeWidthRatio;
  const sideZ = (2.25 + 1.12) / 2 * footprint;
  const frontZ = 2.43 * footprint + floorFrontGlazingGeometry.parameters.depth / 2 + FLOOR_AD_V2.surfaceOffset;
  const sideX = .73 * footprint + floorSideGlazingGeometry.parameters.width / 2 + FLOOR_AD_V2.surfaceOffset;
  const plaque = height * FLOOR_AD_V2.logoHeightRatio;
  const brightness = selected ? 1.11 : hovered ? 1.06 : 1;
  const color = useMemo(() => new Color(brightness, brightness, brightness), [brightness]);
  const click = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(); };
  return <group onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
    <WingStructure footprint={footprint} wing={0} active /><WingStructure footprint={footprint} wing={1} /><WingStructure footprint={footprint} wing={2} />
    <group position={[0, 0, frontZ]}>
      <mesh onClick={click}><planeGeometry args={[frontWidth, height]} /><meshStandardMaterial map={primary} color={color} roughness={.38} metalness={.08} emissive="#062052" emissiveIntensity={.07} side={DoubleSide} /></mesh>
      <mesh position={[-frontWidth / 2 + frontWidth * .04 + plaque / 2, 0, FLOOR_AD_V2.logoAdditionalDepth]} onClick={click}>
        <boxGeometry args={[plaque, plaque, .014]} /><meshStandardMaterial map={plaqueTexture} roughness={.42} metalness={.04} /></mesh>
    </group>
    <group position={[sideX, 0, sideZ]} rotation={[0, Math.PI / 2, 0]}>
      <mesh onClick={click}><planeGeometry args={[sideWidth, height]} /><meshStandardMaterial map={brand} color={color} roughness={.38} metalness={.08} emissive="#062052" emissiveIntensity={.07} side={DoubleSide} /></mesh>
    </group>
    <group position={[-sideX, 0, sideZ]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh onClick={click}><planeGeometry args={[sideWidth, height]} /><meshStandardMaterial color="#0b356b" roughness={.35} metalness={.12} emissive="#062052" emissiveIntensity={.05} side={DoubleSide} /></mesh>
    </group>
    {selected ? [0, 1, 2].map((wing) => <group key={wing} rotation={[0, wing * Math.PI * 2 / 3, 0]} position={[0, 0, 1.27 * footprint]}>
      {[-1, 1].map((edge) => <group key={edge} position={[0, edge * (FLOOR_HEIGHT / 2 + .004), 0]}>
        <mesh position={[0, 0, 1.14 * footprint]}><boxGeometry args={[1.42 * footprint, FLOOR_AD_V2.selectionEdgeThickness, FLOOR_AD_V2.selectionEdgeThickness]} /><meshStandardMaterial color="#5daeff" emissive="#2386ff" emissiveIntensity={.65} /></mesh>
        {edge < 0 ? [-1, 1].map((side) => <mesh key={side} position={[side * .71 * footprint, 0, .495 * footprint]}><boxGeometry args={[FLOOR_AD_V2.selectionEdgeThickness, FLOOR_AD_V2.selectionEdgeThickness, 1.29 * footprint]} /><meshStandardMaterial color="#268aff" emissive="#0877f4" emissiveIntensity={.55} /></mesh>) : null}
      </group>)}
    </group>) : null}
  </group>;
}

function FixtureScene({ listing, selected, onSelect }: { listing: Listing; selected: boolean; onSelect: () => void }) {
  const floorCount = 50;
  return <>
    <color attach="background" args={["#8ecbf0"]} />
    <ambientLight intensity={1.65} />
    <directionalLight position={[6, 9, 7]} intensity={2.2} />
    <directionalLight position={[-5, 4, -3]} intensity={.8} />
    <group position={[0, -FLOOR_PITCH, 0]}>{[0, 1, 2].map((wing) => <WingStructure key={wing} footprint={getFloorFootprint(Math.min(50, listing.rank + 1), floorCount)} wing={wing} />)}</group>
    <FloorBand listing={listing} selected={selected} onSelect={onSelect} />
    <group position={[0, FLOOR_PITCH, 0]}>{[0, 1, 2].map((wing) => <WingStructure key={wing} footprint={getFloorFootprint(Math.max(1, listing.rank - 1), floorCount)} wing={wing} />)}</group>
    <OrbitControls target={[0, 0, 1.25]} enableDamping enablePan={false} minDistance={1.2} maxDistance={11} />
  </>;
}

export default function FloorAdV2FixturePage() {
  const [active, setActive] = useState<Case>("normal");
  const [selected, setSelected] = useState(false);
  if (process.env.NODE_ENV !== "development") return <main>Development fixture unavailable.</main>;
  const listing = cases[active];
  return <main className="floor-v2-fixture">
    <div className="floor-v2-fixture__stage"><Canvas camera={{ position: [1.55, .55, 3.05], fov: 35, near: .05, far: 100 }} dpr={[1, 2]} gl={{ antialias: true }}><FixtureScene listing={listing} selected={selected} onSelect={() => setSelected(true)} /></Canvas></div>
    <nav className="floor-v2-fixture__controls" aria-label="Floor V2 fixture cases">
      <strong>Floor Advertising V2 · isolated fixture</strong>
      {(["normal", "hiring", "summit"] as const).map((kind) => <button key={kind} type="button" aria-pressed={active === kind && !selected} onClick={() => { setActive(kind); setSelected(false); }}>{kind === "summit" ? "#1 floor" : kind === "hiring" ? "Hiring floor" : "Normal floor"}</button>)}
      <button type="button" aria-pressed={selected} onClick={() => { setActive("normal"); setSelected(true); }}>Selected normal + drawer</button>
      <small>Drag to orbit · click any facade to select</small>
    </nav>
    {selected ? <aside className="floor-v2-fixture__drawer" aria-label={`${listing.name} profile`}>
      {listing.hiring ? <div className="floor-v2-fixture__hiring">HIRING ACTIVELY</div> : null}
      <div className="floor-v2-fixture__drawer-body"><div className="floor-v2-fixture__drawer-top"><span className="floor-v2-fixture__mark">{initialsForName(listing.name)}</span><span>RANK #{listing.rank}</span><button type="button" onClick={() => setSelected(false)} aria-label="Close profile">×</button></div>
      <h1>{listing.name}</h1><p className="floor-v2-fixture__amount">{formatMinorUnits(listing.totalPaidMinor)} cumulative</p><div className="floor-v2-fixture__chips"><span>{listing.category}</span>{listing.location ? <span>{listing.location}</span> : null}</div><p>{listing.description}</p><a href={listing.url} target="_blank" rel="noopener noreferrer">Visit website ↗</a><dl><div><dt>Category</dt><dd>{listing.category}</dd></div>{listing.location ? <div><dt>Location</dt><dd>{listing.location}</dd></div> : null}<div><dt>Listed</dt><dd>{new Date(listing.claimedAt).toLocaleDateString()}</dd></div><div><dt>About</dt><dd>{listing.description}</dd></div></dl></div>
    </aside> : null}
  </main>;
}
