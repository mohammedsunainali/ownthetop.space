import { type ThreeEvent } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BoxGeometry, Color, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Vector3 } from "three";
import type { Listing } from "@/domain/listing";
import { useWorldStore } from "@/state/world-store";
import { tokens } from "@/design/tokens";
import { FLOOR_HEIGHT, getFloorFootprint, getFloorY } from "@/world/tower/tower-layout";
import { worldMaterials } from "@/world/materials/world-materials";
import type { TowerVisualConfig } from "@/world/types";
import { createFloorSignTexture, FLOOR_ADVERTISING, FLOOR_FACADE_ROLES, floorContentScale, floorFacadeDimensions, releaseFloorSignTexture, visibleFloorSigns, WING_FACE, type FloorMediaContent } from "@/world/tower/floor-signs";

export const floorWingGeometry = new BoxGeometry(1.42, FLOOR_HEIGHT, 2.28);
export const floorFrontGlazingGeometry = new BoxGeometry(WING_FACE.frontWidth, WING_FACE.clearHeight, 0.035);
const mullionGeometry = new BoxGeometry(0.026, FLOOR_HEIGHT * 0.86, 0.045);
export const floorSideGlazingGeometry = new BoxGeometry(0.035, WING_FACE.clearHeight, WING_FACE.sideWidth);
const sideBarGeometry = new BoxGeometry(0.045, FLOOR_HEIGHT * 0.86, 0.026);
const yAxis = new Vector3(0, 1, 0);
const geometry = floorWingGeometry;
const glazingGeometry = floorFrontGlazingGeometry;
const sideGlassGeometry = floorSideGlazingGeometry;
const trimGeometry = new BoxGeometry(1, 1, 1);
const logoPlaqueMaterial = new MeshStandardMaterial({ color: tokens.color.brand.softWhite, roughness: 0.42, metalness: 0.04 });
const selectionMaterial = new MeshStandardMaterial({ color: tokens.color.brand.blue, emissive: tokens.color.brand.blue, emissiveIntensity: 0.55, metalness: 0.25, roughness: 0.25 });
const summitMaterial = new MeshStandardMaterial({ color: tokens.color.brand.summitGold, emissive: tokens.color.brand.summitGold, emissiveIntensity: 0.14, metalness: 0.45, roughness: 0.28 });

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
      const glassColor = detailed ? new Color("#0b3471") : color;
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
        glass.setColorAt(index * 3 + wing, glassColor);
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
          sides.setColorAt((index * 3 + wing) * 2 + side, glassColor);
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
    if (sides.instanceColor) sides.instanceColor.needsUpdate = true;
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
    {signs.map((listing) => <FloorSign key={listing.id} listing={listing} floorCount={listings.length} detail={focused} selected={listing.id === selectedListingId} onSelect={() => onSelect(listing)} />)}
    {activePreview ? <FloorSign key={activePreview.id} listing={activePreview} floorCount={listings.length} detail preview /> : null}
  </>;
}

function FloorSign({ listing, floorCount, detail, selected = false, preview = false, onSelect }: { listing: FloorMediaContent; floorCount: number; detail: boolean; selected?: boolean; preview?: boolean; onSelect?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const footprint = getFloorFootprint(listing.rank, floorCount);
  const nose = useMemo(() => createFloorSignTexture(listing, "nose", footprint), [listing, footprint]);
  const left = useMemo(() => detail ? createFloorSignTexture(listing, "wing", footprint, "left") : null, [detail, listing, footprint]);
  const right = useMemo(() => detail ? createFloorSignTexture(listing, "wing", footprint, "right") : null, [detail, listing, footprint]);
  const logo = useMemo(() => createFloorSignTexture(listing, "logo", footprint), [listing, footprint]);
  useEffect(() => () => { if (preview) releaseFloorSignTexture(listing.id); }, [listing.id, preview]);
  const y = getFloorY(listing.rank, floorCount);
  const tint = selected ? 1.12 : hovered ? 1.07 : 1;
  const color = useMemo(() => new Color(tint, tint, tint), [tint]);
  const onClick = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect?.(); };
  return <group position={[0, y, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
    {FLOOR_FACADE_ROLES.filter((face) => detail || face.role === "nose").map(({ wing, face, role }) => {
      const bay = floorFacadeDimensions(face, footprint);
      const facePosition: [number, number, number] = face === "front" ? [0, 0, bay.frontZ] : [face === "left" ? -bay.sideX : bay.sideX, 0, bay.sideZ];
      const faceRotation: [number, number, number] = [0, face === "left" ? -Math.PI / 2 : face === "right" ? Math.PI / 2 : 0, 0];
      const texture = role === "nose" ? nose : face === "left" ? left : right;
      const contentScale = floorContentScale(face, bay.width);
      const plaque = bay.height * (role === "nose" ? FLOOR_ADVERTISING.noseLogoSizeRatio * contentScale : FLOOR_ADVERTISING.logoSizeRatio * Math.max(0.82, contentScale));
      const spacingScale = 0.88 + 0.12 * contentScale;
      const plaqueX = role === "nose" ? 0 : face === "left" ? bay.width / 2 - bay.width * 0.045 * spacingScale - plaque / 2 : -bay.width / 2 + bay.width * 0.045 * spacingScale + plaque / 2;
      return <group key={`${wing}-${face}`} rotation={[0, wing * Math.PI * 2 / 3, 0]}>
        <group position={facePosition} rotation={faceRotation}>
          <mesh onClick={onClick}><planeGeometry args={[bay.width, bay.height]} /><meshStandardMaterial map={texture} color={color} transparent depthWrite={false} roughness={0.38} metalness={0.08} /></mesh>
          <mesh position={[plaqueX, role === "nose" && listing.hiring ? -bay.height * 0.07 : 0, FLOOR_ADVERTISING.logoDepth]} onClick={onClick}>
            <boxGeometry args={[plaque, plaque, 0.012]} /><primitive object={logoPlaqueMaterial} attach="material" />
          </mesh>
          <mesh position={[plaqueX, role === "nose" && listing.hiring ? -bay.height * 0.07 : 0, FLOOR_ADVERTISING.logoDepth + 0.0061]} onClick={onClick}>
            <planeGeometry args={[plaque, plaque]} /><meshStandardMaterial map={logo} transparent depthWrite={false} roughness={0.42} metalness={0.04} />
          </mesh>
        </group>
      </group>;
    })}
    {selected || listing.rank === 1 ? <FloorSelectionFrame footprint={footprint} selected={selected} /> : null}
  </group>;
}

function FloorSelectionFrame({ footprint, selected }: { footprint: number; selected: boolean }) {
  const material = selected ? selectionMaterial : summitMaterial;
  const edge = FLOOR_ADVERTISING.selectionEdge;
  // Trim follows the exposed slab perimeter, never a media rectangle or the Y core.
  return <>{[0, 1, 2].map((wing) => <group key={wing} rotation={[0, wing * Math.PI * 2 / 3, 0]}>
    {[-1, 1].map((vertical) => <group key={vertical} position={[0, vertical * (FLOOR_HEIGHT / 2 - edge / 2), 0]}>
      <mesh geometry={trimGeometry} material={material} position={[0, 0, 2.41 * footprint]} scale={[1.42 * footprint, edge, edge]} />
      {[-1, 1].map((side) => <mesh key={side} geometry={trimGeometry} material={material} position={[side * 0.71 * footprint, 0, 1.76 * footprint]} scale={[edge, edge, 1.3 * footprint]} />)}
    </group>)}
  </group>)}</>;
}
