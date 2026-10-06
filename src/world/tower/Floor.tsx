import { type ThreeEvent } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BoxGeometry, Color, EdgesGeometry, InstancedMesh, LineBasicMaterial, Matrix4, Quaternion, Vector3 } from "three";
import type { Listing } from "@/domain/listing";
import { useWorldStore } from "@/state/world-store";
import { tokens } from "@/design/tokens";
import { FLOOR_HEIGHT, getFloorFootprint, getFloorY } from "@/world/tower/tower-layout";
import { worldMaterials } from "@/world/materials/world-materials";
import type { TowerVisualConfig } from "@/world/types";
import { createFloorSignTexture, FLOOR_ADVERTISING, FLOOR_FACADE_ROLES, floorFacadeDimensions, releaseFloorSignTexture, visibleFloorSigns, type FloorMediaContent } from "@/world/tower/floor-signs";

export const floorWingGeometry = new BoxGeometry(1.42, FLOOR_HEIGHT, 2.28);
export const floorFrontGlazingGeometry = new BoxGeometry(1.31, FLOOR_HEIGHT * 0.84, 0.035);
const mullionGeometry = new BoxGeometry(0.026, FLOOR_HEIGHT * 0.86, 0.045);
export const floorSideGlazingGeometry = new BoxGeometry(0.035, FLOOR_HEIGHT * 0.84, 2.07);
const sideBarGeometry = new BoxGeometry(0.045, FLOOR_HEIGHT * 0.86, 0.026);
const yAxis = new Vector3(0, 1, 0);
const geometry = floorWingGeometry;
const glazingGeometry = floorFrontGlazingGeometry;
const sideGlassGeometry = floorSideGlazingGeometry;
const floorEdgeGeometry = new EdgesGeometry(geometry);
const selectionMaterial = new LineBasicMaterial({ color: tokens.color.brand.blue });
const summitMaterial = new LineBasicMaterial({ color: tokens.color.brand.summitGold });

/** One paid listing maps to exactly three decorative wing instances. */
export function listingForInstance(listings: readonly Listing[], instanceId: number): Listing | undefined {
  return listings[Math.floor(instanceId / 3)];
}

export function paidFloorColor(rank: number, accent: TowerVisualConfig["accent"]): string {
  void rank;
  return tokens.color.brand[accent === "blue" ? "lightBlue" : accent];
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
            // The inner/core mullion stays; the two outer bars cross the media bay.
            scale.setScalar(detailed && bar > 0 ? 0 : 1);
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
    {signs.map((listing) => <FloorSign key={listing.id} listing={listing} floorCount={listings.length} selected={listing.id === selectedListingId} onSelect={() => onSelect(listing)} />)}
    {activePreview ? <FloorSign key={activePreview.id} listing={activePreview} floorCount={listings.length} preview /> : null}
  </>;
}

function FloorSign({ listing, floorCount, selected = false, preview = false, onSelect }: { listing: FloorMediaContent; floorCount: number; selected?: boolean; preview?: boolean; onSelect?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const footprint = getFloorFootprint(listing.rank, floorCount);
  const primary = useMemo(() => createFloorSignTexture(listing, "primary", footprint), [listing, footprint]);
  const brandFront = useMemo(() => createFloorSignTexture(listing, "brand", footprint), [listing, footprint]);
  const brandSide = useMemo(() => createFloorSignTexture(listing, "brand", footprint, "left"), [listing, footprint]);
  const status = useMemo(() => createFloorSignTexture(listing, "status", footprint, "right"), [listing, footprint]);
  const logo = useMemo(() => createFloorSignTexture(listing, "logo", footprint), [listing, footprint]);
  useEffect(() => () => { if (preview) releaseFloorSignTexture(listing.id); }, [listing.id, preview]);
  const y = getFloorY(listing.rank, floorCount);
  const tint = selected ? 1.12 : hovered ? 1.07 : 1;
  const color = useMemo(() => new Color(tint, tint, tint), [tint]);
  const onClick = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect?.(); };
  const front = floorFacadeDimensions("front", footprint);
  const plaque = front.height * FLOOR_ADVERTISING.logoSizeRatio;
  return <group position={[0, y, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
    {FLOOR_FACADE_ROLES.map(({ wing, face, role }) => {
      const bay = floorFacadeDimensions(face, footprint);
      const facePosition: [number, number, number] = face === "front" ? [0, 0, bay.frontZ] : [face === "left" ? -bay.sideX : bay.sideX, 0, bay.sideZ];
      const faceRotation: [number, number, number] = [0, face === "left" ? -Math.PI / 2 : face === "right" ? Math.PI / 2 : 0, 0];
      const texture = role === "primary" ? primary : role === "status" ? status : face === "front" ? brandFront : brandSide;
      return <group key={`${wing}-${face}`} rotation={[0, wing * Math.PI * 2 / 3, 0]}>
        <group position={facePosition} rotation={faceRotation}>
          <mesh onClick={onClick}><planeGeometry args={[bay.width, bay.height]} /><meshBasicMaterial map={texture} color={color} transparent depthWrite={false} toneMapped={false} /></mesh>
          {role === "primary" ? <mesh position={[-bay.width / 2 + 48 / FLOOR_ADVERTISING.primaryTextureWidth * bay.width + plaque / 2, 0, FLOOR_ADVERTISING.logoDepth]} onClick={onClick}>
            <planeGeometry args={[plaque, plaque]} /><meshBasicMaterial map={logo} transparent toneMapped={false} />
          </mesh> : null}
        </group>
      </group>;
    })}
    {selected || listing.rank === 1 ? [0, 1, 2].map((wing) => <group key={`edge-${wing}`} rotation={[0, wing * Math.PI * 2 / 3, 0]}>
      <lineSegments geometry={floorEdgeGeometry} material={selected ? selectionMaterial : summitMaterial} position={[0, 0, 1.27 * footprint]} scale={[footprint, 1, footprint]} />
    </group>) : null}
  </group>;
}
