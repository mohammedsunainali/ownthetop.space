import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, BufferGeometry, CanvasTexture, Color, FrontSide, Group, InstancedMesh, LineBasicMaterial, Matrix4, MeshBasicMaterial, PlaneGeometry, Quaternion, SRGBColorSpace, Vector3 } from "three";
import type { Listing } from "@/domain/listing";
import { useWorldStore } from "@/state/world-store";
import { tokens } from "@/design/tokens";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { FLOOR_HEIGHT, getFloorFootprint, getFloorY } from "@/world/tower/tower-layout";
import { worldMaterials } from "@/world/materials/world-materials";
import type { TowerVisualConfig } from "@/world/types";
import { createFloorSignTexture, FACADE_BAYS, releaseFloorSignTexture, visibleFloorSigns, type FloorMediaContent } from "@/world/tower/floor-signs";

const geometry = new BoxGeometry(1.42, FLOOR_HEIGHT, 2.28);
const glazingGeometry = new BoxGeometry(1.31, FLOOR_HEIGHT * 0.84, 0.035);
const mullionGeometry = new BoxGeometry(0.026, FLOOR_HEIGHT * 0.86, 0.045);
const sideGlassGeometry = new BoxGeometry(0.035, FLOOR_HEIGHT * 0.84, 2.07);
const sideBarGeometry = new BoxGeometry(0.045, FLOOR_HEIGHT * 0.86, 0.026);
const yAxis = new Vector3(0, 1, 0);
const hiringPlane = new PlaneGeometry(0.34, 0.105);
const hiringWires = new BufferGeometry().setFromPoints([
  new Vector3(-0.13, 0.05, 0), new Vector3(-0.08, 0.13, 0),
  new Vector3(0.13, 0.05, 0), new Vector3(0.08, 0.13, 0),
]);
const hiringWireMaterial = new LineBasicMaterial({ color: tokens.color.brand.navy });

/** One paid listing maps to exactly three decorative wing instances. */
export function listingForInstance(listings: readonly Listing[], instanceId: number): Listing | undefined {
  return listings[Math.floor(instanceId / 3)];
}

export function paidFloorColor(rank: number, accent: TowerVisualConfig["accent"]): string {
  return rank === 1 ? tokens.color.brand.summitGold : tokens.color.brand[accent === "blue" ? "lightBlue" : accent];
}

interface RankedFloorsProps {
  listings: readonly Listing[];
  accent: TowerVisualConfig["accent"];
  selectedListingId: string | null;
  focused: boolean;
  focusedRank?: number;
  exploded: boolean;
  onSelect: (listing: Listing) => void;
}

export function RankedFloors({ listings, accent, selectedListingId, focused, focusedRank, exploded, onSelect }: RankedFloorsProps) {
  const mesh = useRef<InstancedMesh>(null);
  const glazing = useRef<InstancedMesh>(null);
  const mullions = useRef<InstancedMesh>(null);
  const sideGlass = useRef<InstancedMesh>(null);
  const sideBars = useRef<InstancedMesh>(null);
  const count = listings.length * 3;
  const preview = useWorldStore((state) => state.floorPreview);
  const activePreview = focused && preview?.towerId === listings[0]?.towerId ? preview.media : null;
  const signs = useMemo(() => visibleFloorSigns(listings, selectedListingId, focused, focusedRank).filter((item) => item.rank !== activePreview?.rank), [activePreview?.rank, focused, focusedRank, listings, selectedListingId]);
  const detailedRanks = useMemo(() => new Set([...signs.map((item) => item.rank), ...(activePreview ? [activePreview.rank] : [])]), [signs, activePreview]);

  useLayoutEffect(() => {
    const instance = mesh.current;
    const glass = glazing.current;
    const bars = mullions.current;
    const sides = sideGlass.current;
    const sideFrames = sideBars.current;
    if (!instance || !glass || !bars || !sides || !sideFrames) return;
    const matrix = new Matrix4();
    const rotation = new Quaternion();
    const position = new Vector3();
    const scale = new Vector3();
    listings.forEach((listing, index) => {
      const footprint = getFloorFootprint(listing.rank, listings.length);
      const y = getFloorY(listing.rank, listings.length);
      const color = new Color(paidFloorColor(listing.rank, accent));
      const detailed = detailedRanks.has(listing.rank);
      for (let wing = 0; wing < 3; wing++) {
        const angle = wing * Math.PI * 2 / 3;
        rotation.setFromAxisAngle(yAxis, angle);
        const radius = (1.27 + (exploded ? 0.34 : 0)) * footprint;
        position.set(Math.sin(angle) * radius, y, Math.cos(angle) * radius);
        scale.set(footprint, 1, footprint);
        matrix.compose(position, rotation, scale);
        instance.setMatrixAt(index * 3 + wing, matrix);
        instance.setColorAt(index * 3 + wing, color);
        position.set(Math.sin(angle) * 2.43 * footprint, y, Math.cos(angle) * 2.43 * footprint);
        scale.set(footprint, 1, 1);
        matrix.compose(position, rotation, scale);
        glass.setMatrixAt(index * 3 + wing, matrix);
        glass.setColorAt(index * 3 + wing, color);
        for (let bar = 0; bar < 3; bar++) {
          const offset = (bar - 1) * 0.31 * footprint;
          position.set(Math.sin(angle) * (2.43 * footprint) + Math.cos(angle) * offset, y, Math.cos(angle) * (2.43 * footprint) - Math.sin(angle) * offset);
          scale.setScalar(detailed ? 0 : 1);
          matrix.compose(position, rotation, scale);
          bars.setMatrixAt((index * 3 + wing) * 3 + bar, matrix);
        }
        for (let side = 0; side < 2; side++) {
          const sideSign = side === 0 ? -1 : 1;
          const centerRadius = 1.27 * footprint;
          const sideOffset = sideSign * 0.73 * footprint;
          position.set(Math.sin(angle) * centerRadius + Math.cos(angle) * sideOffset, y, Math.cos(angle) * centerRadius - Math.sin(angle) * sideOffset);
          scale.set(1, 1, footprint);
          matrix.compose(position, rotation, scale);
          sides.setMatrixAt((index * 3 + wing) * 2 + side, matrix);
          for (let bar = 0; bar < 3; bar++) {
            const longitudinal = (bar - 1) * 0.47 * footprint;
            position.set(Math.sin(angle) * (centerRadius + longitudinal) + Math.cos(angle) * sideOffset, y, Math.cos(angle) * (centerRadius + longitudinal) - Math.sin(angle) * sideOffset);
            scale.setScalar(detailed ? 0 : 1);
            matrix.compose(position, rotation, scale);
            sideFrames.setMatrixAt(((index * 3 + wing) * 2 + side) * 3 + bar, matrix);
          }
        }
      }
    });
    instance.instanceMatrix.needsUpdate = true;
    if (instance.instanceColor) instance.instanceColor.needsUpdate = true;
    instance.computeBoundingSphere();
    glass.instanceMatrix.needsUpdate = true;
    if (glass.instanceColor) glass.instanceColor.needsUpdate = true;
    glass.computeBoundingSphere();
    bars.instanceMatrix.needsUpdate = true;
    bars.computeBoundingSphere();
    sides.instanceMatrix.needsUpdate = true;
    sides.computeBoundingSphere();
    sideFrames.instanceMatrix.needsUpdate = true;
    sideFrames.computeBoundingSphere();
  }, [listings, exploded, accent, detailedRanks]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const listing = listingForInstance(listings, event.instanceId ?? -1);
    if (listing) onSelect(listing);
  };

  return <>
    <instancedMesh ref={mesh} args={[geometry, worldMaterials.facade, count]} onClick={handleClick} castShadow receiveShadow frustumCulled />
    <instancedMesh ref={glazing} args={[glazingGeometry, worldMaterials.glazing, count]} onClick={handleClick} frustumCulled />
    <instancedMesh ref={mullions} args={[mullionGeometry, worldMaterials.frame, count * 3]} frustumCulled />
    <instancedMesh ref={sideGlass} args={[sideGlassGeometry, worldMaterials.sideGlazing, count * 2]} frustumCulled />
    <instancedMesh ref={sideBars} args={[sideBarGeometry, worldMaterials.frame, count * 6]} frustumCulled />
    {signs.map((listing) => <FloorSign key={listing.id} listing={listing} floorCount={listings.length} onSelect={() => onSelect(listing)} />)}
    {activePreview ? <FloorSign key={activePreview.id} listing={activePreview} floorCount={listings.length} preview /> : null}
    <HiringSigns listings={activePreview ? [...signs, activePreview] : signs} floorCount={listings.length} />
  </>;
}

function HiringSigns({ listings, floorCount }: { listings: readonly FloorMediaContent[]; floorCount: number }) {
  const reducedMotion = useReducedMotion();
  const signs = useRef<Group>(null);
  const hiring = useMemo(() => listings.filter((listing) => listing.hiring), [listings]);
  const material = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 160;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = tokens.color.brand.teal; context.fillRect(0, 0, 512, 160);
      context.strokeStyle = tokens.color.brand.navy; context.lineWidth = 12; context.strokeRect(6, 6, 500, 148);
      context.fillStyle = tokens.color.brand.navy; context.textAlign = "center"; context.textBaseline = "middle";
      context.font = "800 92px Inter, system-ui, sans-serif"; context.fillText("HIRING", 256, 84);
    }
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace;
    return new MeshBasicMaterial({ map, side: FrontSide, toneMapped: false });
  }, []);
  useEffect(() => () => { material.map?.dispose(); material.dispose(); }, [material]);
  useFrame(({ clock }) => {
    signs.current?.children.forEach((wingGroup, index) => {
      const hanging = wingGroup.children[0];
      if (hanging) hanging.rotation.z = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 1.5 + index * 0.77) * 0.025;
    });
  });
  return <group ref={signs}>{hiring.flatMap((listing) => {
    const footprint = getFloorFootprint(listing.rank, floorCount);
    return [0, 1, 2].map((wing) => <group key={`${listing.id}-${wing}`} position={[0, getFloorY(listing.rank, floorCount), 0]} rotation={[0, wing * Math.PI * 2 / 3, 0]}>
      <group position={[0.04 * footprint, -0.16, 2.43 * footprint + 0.04]}>
        <lineSegments geometry={hiringWires} material={hiringWireMaterial} position={[0, 0, 0.012]} />
        <mesh geometry={hiringPlane} material={material} position={[0, 0, 0.018]} />
        <mesh geometry={hiringPlane} material={material} position={[0, 0, -0.018]} rotation={[0, Math.PI, 0]} />
      </group>
    </group>);
  })}</group>;
}

function FloorSign({ listing, floorCount, preview = false, onSelect }: { listing: FloorMediaContent; floorCount: number; preview?: boolean; onSelect?: () => void }) {
  const footprint = getFloorFootprint(listing.rank, floorCount);
  const wideTexture = useMemo(() => createFloorSignTexture(listing, "wide", footprint), [listing, footprint]);
  const compactTexture = useMemo(() => createFloorSignTexture(listing, "compact", footprint), [listing, footprint]);
  useEffect(() => () => { if (preview) releaseFloorSignTexture(listing.id); }, [listing.id, preview]);
  const y = getFloorY(listing.rank, floorCount);
  return <group position={[0, y, 0]}>
    {[0, 1, 2].map((wing) => <group key={wing} rotation={[0, wing * Math.PI * 2 / 3, 0]}>
      <mesh position={[0, 0, FACADE_BAYS.compact.outward * footprint + 0.023]} onClick={(event) => { event.stopPropagation(); onSelect?.(); }}>
        <planeGeometry args={[FACADE_BAYS.compact.width * footprint, FACADE_BAYS.compact.height]} />
        <meshBasicMaterial map={compactTexture} toneMapped={false} />
      </mesh>
      {[-1, 1].map((side) => <mesh key={side} position={[side * (FACADE_BAYS.wide.outward * footprint + 0.023), 0, FACADE_BAYS.wide.longitudinal * footprint]} rotation={[0, side * Math.PI / 2, 0]} onClick={(event) => { event.stopPropagation(); onSelect?.(); }}>
        <planeGeometry args={[FACADE_BAYS.wide.width * footprint, FACADE_BAYS.wide.height]} />
        <meshBasicMaterial map={wideTexture} toneMapped={false} />
      </mesh>)}
    </group>)}
  </group>;
}
