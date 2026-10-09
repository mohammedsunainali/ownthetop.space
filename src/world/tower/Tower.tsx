import type { Listing } from "@/domain/listing";
import type { Tower as TowerData } from "@/domain/tower";
import { useWorldStore } from "@/state/world-store";
import { RectangularFloors as RankedFloors } from "@/world/tower/RectangularFloors";
import { TowerShell } from "@/world/tower/TowerShell";
import { HeightRuler } from "@/world/tower/HeightRuler";
import { getNearestFloorRank, getTowerHeight, towerVisuals } from "@/world/tower/tower-layout";

interface TowerProps {
  tower: TowerData;
  listings: readonly Listing[];
}

export function Tower({ tower, listings }: TowerProps) {
  const selectedListingId = useWorldStore((state) => state.selectedListingId);
  const selectedTowerId = useWorldStore((state) => state.selectedTowerId);
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const floorsExploded = useWorldStore((state) => state.floorsExploded);
  const rulerVisible = useWorldStore((state) => state.rulerVisible);
  const towerTravelY = useWorldStore((state) => state.towerTravelY);
  const floorPreview = useWorldStore((state) => state.floorPreview);
  const selectListing = useWorldStore((state) => state.selectListing);
  const selectTower = useWorldStore((state) => state.selectTower);
  const visual = towerVisuals[tower.id];
  const height = getTowerHeight(listings.length,floorsExploded);

  return (
    <group position={visual.position} rotation={[0, visual.rotation, 0]} scale={visual.scale}>
      <TowerShell towerId={tower.id} height={height} floorCount={listings.length} premium={tower.id === "companies"} focused={selectedTowerId === tower.id && cameraMode !== "overview"} onSelect={() => selectTower(tower.id)} />
      <RankedFloors listings={listings} accent={visual.accent} selectedListingId={selectedListingId} focused={selectedTowerId === tower.id && cameraMode !== "overview"} focusedRank={selectedTowerId === tower.id ? towerTravelY !== null ? getNearestFloorRank(towerTravelY, listings.length, floorsExploded) : floorPreview?.towerId === tower.id ? floorPreview.media.rank : selectedListingId || cameraMode === "topFloor" || cameraMode === "rooftop" ? undefined : getNearestFloorRank(height * 0.72, listings.length, floorsExploded) : undefined} exploded={floorsExploded} onSelect={(selected) => selectListing(selected.id, selected.towerId)} />
      {rulerVisible && (selectedTowerId ?? "companies") === tower.id ? <HeightRuler floorCount={listings.length} /> : null}
    </group>
  );
}
