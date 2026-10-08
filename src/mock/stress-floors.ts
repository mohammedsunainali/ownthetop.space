import type { Listing } from "@/domain/listing";
import { listingsByTower, regressionListingsByTower } from "@/mock";

/** Development-only visual load; these are never represented as real claimed listings. */
export function createStressListings(count = 220): readonly Listing[] {
  return Array.from({ length: count }, (_, index) => {
    const rank = index + 1;
    return {
      id: `stress-company-${rank}`,
      towerId: "companies" as const,
      entityType: "company" as const,
      normalizedUrl: `https://fixture-${rank}.example`,
      url: `https://fixture-${rank}.example`,
      name: `Fixture Studio ${String(rank).padStart(3, "0")}`,
      description: `Synthetic floor ${rank} for renderer testing`,
      logoUrl: null,
      category: "Stress fixture",
      location: null,
      hiring: rank % 7 === 0,
      totalPaidMinor: (count - index) * 100,
      currency: "USD" as const,
      rank,
      claimedAt: new Date(Date.UTC(2026, 0, 1, 0, 0, rank)).toISOString(),
    };
  });
}

export function getSceneListings(stress: boolean, legacy=false) {
  return stress ? { companies: createStressListings(), products: [], people: [] } : legacy ? regressionListingsByTower : listingsByTower;
}
