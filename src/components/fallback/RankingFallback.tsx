"use client";

import { formatMinorUnits } from "@/domain/money";
import { listingsByTower } from "@/mock";
import { towers } from "@/mock/towers";
import { useWorldStore } from "@/state/world-store";

export function RankingFallback() {
  const selectedListingId = useWorldStore((state) => state.selectedListingId);
  const selectListing = useWorldStore((state) => state.selectListing);
  return <div className="webgl-fallback" aria-label="2D ranking fallback">
    <strong>Explore the skyline rankings</strong>
    <p>3D is unavailable on this device. Select any floor to see its profile.</p>
    <div className="fallback-grid">
      {towers.map((tower) => <section className="fallback-tower" key={tower.id} aria-label={`${tower.name} rankings`}>
        <h2>{tower.name}</h2>
        {listingsByTower[tower.id].map((listing) => <button key={listing.id} type="button" aria-current={selectedListingId === listing.id ? "true" : undefined} onClick={() => selectListing(listing.id, tower.id)}>
          <span>#{listing.rank} {listing.name}</span><strong>{formatMinorUnits(listing.totalPaidMinor)}</strong>
        </button>)}
      </section>)}
    </div>
  </div>;
}
