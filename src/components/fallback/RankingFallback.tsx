"use client";

import { formatMinorUnits } from "@/domain/money";
import { listingsByTower } from "@/mock";
import { towers } from "@/mock/towers";
import { useWorldStore } from "@/state/world-store";
import type { Listing } from "@/domain/listing";
import type { TowerId } from "@/domain/tower";

export function RankingFallback({ inventory = listingsByTower, requested = false }: { inventory?: Record<TowerId, readonly Listing[]>; requested?: boolean }) {
  const selectedListingId = useWorldStore((state) => state.selectedListingId);
  const selectListing = useWorldStore((state) => state.selectListing);
  return <div className="webgl-fallback" aria-label="2D ranking fallback">
    <strong>Explore the skyline rankings</strong>
    <p>{requested ? "Accessible list view." : "3D is unavailable on this device."} Select any floor to see its profile. These are synthetic demo listings.</p>
    {requested && <button type="button" onClick={() => { const url = new URL(window.location.href); url.searchParams.delete("view"); window.location.assign(url.toString()); }}>Return to 3D skyline</button>}
    <div className="fallback-grid">
      {towers.map((tower) => <section className="fallback-tower" key={tower.id} aria-label={`${tower.name} rankings`}>
        <h2>{tower.name}</h2>
        {inventory[tower.id].map((listing) => <button key={listing.id} type="button" aria-current={selectedListingId === listing.id ? "true" : undefined} onClick={() => selectListing(listing.id, tower.id)}>
          <span>#{listing.rank} {listing.name}</span><strong>{formatMinorUnits(listing.totalPaidMinor)}</strong>
        </button>)}
      </section>)}
    </div>
  </div>;
}
