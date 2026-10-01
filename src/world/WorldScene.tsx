import type { Listing } from "@/domain/listing";
import type { TowerId } from "@/domain/tower";
import { towers } from "@/mock/towers";
import { useWorldStore } from "@/state/world-store";
import { CameraController } from "@/world/camera/CameraController";
import { BasicEnvironment } from "@/world/environment/BasicEnvironment";
import { Tower } from "@/world/tower/Tower";
import { RendererDiagnostics } from "@/world/RendererDiagnostics";

export function WorldScene({ listingsByTower }: { listingsByTower: Record<TowerId, readonly Listing[]> }) {
  const allListings = Object.values(listingsByTower).flat();
  const floorCounts = { companies: listingsByTower.companies.length, products: listingsByTower.products.length, people: listingsByTower.people.length };
  const selectedListingId = useWorldStore((state) => state.selectedListingId);
  const selectedListing = allListings.find((listing) => listing.id === selectedListingId) ?? null;

  return (
    <>
      <BasicEnvironment tallestFloorCount={Math.max(...Object.values(floorCounts))} />
      {towers.map((tower) => (
        <Tower key={tower.id} tower={tower} listings={listingsByTower[tower.id]} />
      ))}
      <CameraController selectedListing={selectedListing} floorCounts={floorCounts} />
      {process.env.NODE_ENV === "development" ? <RendererDiagnostics /> : null}
    </>
  );
}
