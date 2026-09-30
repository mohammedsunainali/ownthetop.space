import type { Listing } from "@/domain/listing";
import type { Tower as TowerData } from "@/domain/tower";
import { useWorldStore } from "@/state/world-store";
import { Floor } from "@/world/tower/Floor";
import { TowerShell } from "@/world/tower/TowerShell";
import { getFloorFootprint, getFloorY, getTowerHeight, towerVisuals } from "@/world/tower/tower-layout";

interface TowerProps {
  tower: TowerData;
  listings: readonly Listing[];
}

export function Tower({ tower, listings }: TowerProps) {
  const selectedListingId = useWorldStore((state) => state.selectedListingId);
  const selectedTowerId = useWorldStore((state) => state.selectedTowerId);
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const floorsExploded = useWorldStore((state) => state.floorsExploded);
  const selectListing = useWorldStore((state) => state.selectListing);
  const selectTower = useWorldStore((state) => state.selectTower);
  const visual = towerVisuals[tower.id];
  const height = getTowerHeight(listings.length);

  return (
    <group position={visual.position} scale={visual.scale}>
      <TowerShell height={height} floorCount={listings.length} onSelect={() => selectTower(tower.id)} />
      {listings.map((listing) => (
        <Floor
          key={listing.id}
          listing={listing}
          y={getFloorY(listing.rank, listings.length)}
          accent={visual.accent}
          footprint={getFloorFootprint(listing.rank, listings.length)}
          selected={listing.id === selectedListingId}
          showLabel={listing.id === selectedListingId || (selectedTowerId === tower.id && cameraMode !== "overview" && listing.rank === 1)}
          exploded={floorsExploded}
          onSelect={(selected) => selectListing(selected.id, selected.towerId)}
        />
      ))}
    </group>
  );
}
