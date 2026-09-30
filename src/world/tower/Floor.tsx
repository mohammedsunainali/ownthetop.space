import type { ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Listing } from "@/domain/listing";
import { formatMinorUnits } from "@/domain/money";
import { FLOOR_HEIGHT } from "@/world/tower/tower-layout";
import { worldMaterials } from "@/world/materials/world-materials";
import type { TowerVisualConfig } from "@/world/types";
import { BoxGeometry } from "three";

const floorGeometry = new BoxGeometry(1.18, FLOOR_HEIGHT, 2.06);

interface FloorProps {
  listing: Listing;
  y: number;
  accent: TowerVisualConfig["accent"];
  footprint: number;
  selected: boolean;
  showLabel: boolean;
  exploded: boolean;
  onSelect: (listing: Listing) => void;
}

export function Floor({ listing, y, accent, footprint, selected, showLabel, exploded, onSelect }: FloorProps) {
  const radialOffset = exploded ? 0.28 : 0;
  const material = listing.rank === 1
    ? selected ? worldMaterials.selectedSummit : worldMaterials.summit
    : selected ? worldMaterials.selected : worldMaterials.floor[accent];
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(listing);
  };

  return (
    <group position={[0, y, 0]} scale={[footprint, 1, footprint]}>
      {showLabel ? <Html center position={[0, 0.65, 0]} className="floor-callout" distanceFactor={8} style={{ pointerEvents: "none" }}>
        <span>#{listing.rank} · {listing.name} · {formatMinorUnits(listing.totalPaidMinor)}</span>
      </Html> : null}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <mesh
            geometry={floorGeometry}
            material={material}
            position={[0, 0, 1.16 + radialOffset]}
            scale={selected ? [1.07, 1.12, 1.07] : 1}
            castShadow
            receiveShadow
            onClick={handleClick}
          >
          </mesh>
        </group>
      ))}
    </group>
  );
}
