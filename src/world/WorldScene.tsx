import { allListings, listingsByTower } from "@/mock";
import { towers } from "@/mock/towers";
import { useWorldStore } from "@/state/world-store";
import { CameraController } from "@/world/camera/CameraController";
import { BasicEnvironment } from "@/world/environment/BasicEnvironment";
import { Tower } from "@/world/tower/Tower";

const floorCounts = {
  companies: listingsByTower.companies.length,
  products: listingsByTower.products.length,
  people: listingsByTower.people.length,
};

export function WorldScene() {
  const selectedListingId = useWorldStore((state) => state.selectedListingId);
  const selectedListing = allListings.find((listing) => listing.id === selectedListingId) ?? null;

  return (
    <>
      <BasicEnvironment />
      {towers.map((tower) => (
        <Tower key={tower.id} tower={tower} listings={listingsByTower[tower.id]} />
      ))}
      <CameraController selectedListing={selectedListing} floorCounts={floorCounts} />
    </>
  );
}
