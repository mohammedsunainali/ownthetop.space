import type { Listing } from "@/domain/listing";
import type { Tower as TowerData } from "@/domain/tower";
import { useWorldStore } from "@/state/world-store";
import { Floor } from "@/world/tower/Floor";
import { TowerShell } from "@/world/tower/TowerShell";
import { getFloorY, getTowerHeight, towerVisuals } from "@/world/tower/tower-layout";

interface TowerProps {
  tower: TowerData;
  listings: readonly Listing[];
}

export function Tower({ tower, listings }: TowerProps) {
  const selectedListingId = useWorldStore((state) => state.selectedListingId);
  const floorsExploded = useWorldStore((state) => state.floorsExploded);
  const selectListing = useWorldStore((state) => state.selectListing);
  const selectTower = useWorldStore((state) => state.selectTower);
  const visual = towerVisuals[tower.id];
  const height = getTowerHeight(listings.length);

  return (
    <group position={visual.position} scale={visual.scale}>
      <TowerShell height={height} accent={visual.accent} glass={visual.glass} onSelect={() => selectTower(tower.id)} />
      {listings.map((listing) => (
        <Floor
          key={listing.id}
          listing={listing}
          y={getFloorY(listing.rank, listings.length)}
          accent={visual.accent}
          selected={listing.id === selectedListingId}
          exploded={floorsExploded}
          onSelect={(selected) => selectListing(selected.id, selected.towerId)}
        />
      ))}
    </group>
  );
}
