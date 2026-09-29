import { allListings, listingsByTower } from "@/mock";
import { towers } from "@/mock/towers";
import { useWorldStore } from "@/state/world-store";
import { CameraController } from "@/world/camera/CameraController";
import { BasicEnvironment } from "@/world/environment/BasicEnvironment";
import { Tower } from "@/world/tower/Tower";

export function WorldScene() {
  const selectedListingId = useWorldStore((state) => state.selectedListingId);
  const selectedListing = allListings.find((listing) => listing.id === selectedListingId) ?? null;
  const selectedFloorCount = selectedListing ? listingsByTower[selectedListing.towerId].length : 0;

  return (
    <>
      <BasicEnvironment />
      {towers.map((tower) => (
        <Tower key={tower.id} tower={tower} listings={listingsByTower[tower.id]} />
      ))}
      <CameraController selectedListing={selectedListing} floorCount={selectedFloorCount} />
    </>
  );
}
