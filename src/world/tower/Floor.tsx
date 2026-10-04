import type { ThreeEvent } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Color, InstancedMesh, Matrix4, Quaternion, Vector3 } from "three";
import type { Listing } from "@/domain/listing";
import { tokens } from "@/design/tokens";
import { FLOOR_HEIGHT, getFloorFootprint, getFloorY } from "@/world/tower/tower-layout";
import { worldMaterials } from "@/world/materials/world-materials";
import type { TowerVisualConfig } from "@/world/types";
import { createFloorSignTexture, visibleFloorSigns } from "@/world/tower/floor-signs";

const geometry = new BoxGeometry(1.42, FLOOR_HEIGHT, 2.28);
const glazingGeometry = new BoxGeometry(1.31, FLOOR_HEIGHT * 0.84, 0.035);
const mullionGeometry = new BoxGeometry(0.026, FLOOR_HEIGHT * 0.86, 0.045);
const sideGlassGeometry = new BoxGeometry(0.035, FLOOR_HEIGHT * 0.84, 2.07);
const sideBarGeometry = new BoxGeometry(0.045, FLOOR_HEIGHT * 0.86, 0.026);
const yAxis = new Vector3(0, 1, 0);

/** One paid listing maps to exactly three decorative wing instances. */
export function listingForInstance(listings: readonly Listing[], instanceId: number): Listing | undefined {
  return listings[Math.floor(instanceId / 3)];
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
  const signs = useMemo(() => visibleFloorSigns(listings, selectedListingId, focused, focusedRank), [focused, focusedRank, listings, selectedListingId]);

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
    const accentColor = new Color(tokens.color.brand[accent === "blue" ? "lightBlue" : accent]);
    listings.forEach((listing, index) => {
      const footprint = getFloorFootprint(listing.rank, listings.length);
      const y = getFloorY(listing.rank, listings.length);
      const selected = listing.id === selectedListingId;
      const color = listing.rank === 1 ? new Color(tokens.color.brand.summitGold) : selected ? new Color(tokens.color.brand.white) : accentColor;
      for (let wing = 0; wing < 3; wing++) {
        const angle = wing * Math.PI * 2 / 3;
        rotation.setFromAxisAngle(yAxis, angle);
        const radius = (1.27 + (exploded ? 0.34 : 0)) * footprint;
        position.set(Math.sin(angle) * radius, y, Math.cos(angle) * radius);
        scale.set(footprint * (selected ? 1.07 : 1), selected ? 1.12 : 1, footprint * (selected ? 1.07 : 1));
        matrix.compose(position, rotation, scale);
        instance.setMatrixAt(index * 3 + wing, matrix);
        instance.setColorAt(index * 3 + wing, color);
        position.set(Math.sin(angle) * 2.43 * footprint, y, Math.cos(angle) * 2.43 * footprint);
        scale.set(footprint, 1, 1);
        matrix.compose(position, rotation, scale);
        glass.setMatrixAt(index * 3 + wing, matrix);
        glass.setColorAt(index * 3 + wing, listing.rank === 1 ? new Color(tokens.color.brand.summitGold) : new Color(tokens.color.brand.blue));
        for (let bar = 0; bar < 3; bar++) {
          const offset = (bar - 1) * 0.31 * footprint;
          position.set(Math.sin(angle) * (2.43 * footprint) + Math.cos(angle) * offset, y, Math.cos(angle) * (2.43 * footprint) - Math.sin(angle) * offset);
          scale.set(1, 1, 1);
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
            scale.set(1, 1, 1);
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
  }, [listings, selectedListingId, exploded, accent]);

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
    {signs.map((listing) => <FloorSign key={listing.id} listing={listing} floorCount={listings.length} selected={listing.id === selectedListingId} onSelect={onSelect} />)}
  </>;
}

function FloorSign({ listing, floorCount, selected, onSelect }: { listing: Listing; floorCount: number; selected: boolean; onSelect: (listing: Listing) => void }) {
  const texture = useMemo(() => createFloorSignTexture(listing), [listing]);
  const footprint = getFloorFootprint(listing.rank, floorCount);
  const y = getFloorY(listing.rank, floorCount);
  return <group position={[0, y, 0]}>
    {[0, 1, 2].map((wing) => <group key={wing} rotation={[0, wing * Math.PI * 2 / 3, 0]}>
      <mesh position={[0, 0, 2.53 * footprint]} onClick={(event) => { event.stopPropagation(); onSelect(listing); }}>
        <planeGeometry args={[1.31 * footprint * (selected ? 1.04 : 1), FLOOR_HEIGHT * 0.84]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {[-1, 1].map((side) => <mesh key={side} position={[side * 0.75 * footprint, 0, 1.27 * footprint]} rotation={[0, side * Math.PI / 2, 0]} onClick={(event) => { event.stopPropagation(); onSelect(listing); }}>
        <planeGeometry args={[2.08 * footprint, FLOOR_HEIGHT * 0.84]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>)}
    </group>)}
  </group>;
}
