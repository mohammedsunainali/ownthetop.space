import type { EntityType, UnrankedListing } from "@/domain/listing";
import type { TowerId } from "@/domain/tower";

export interface MockListingSeed {
  name: string;
  totalPaidMinor: number;
  category: string;
  description: string;
  location?: string | null;
  hiring?: boolean;
  logoUrl?: string | null;
}

export function createListings(
  towerId: TowerId,
  entityType: EntityType,
  seeds: readonly MockListingSeed[],
): UnrankedListing[] {
  return seeds.map((seed, index) => {
    const slug = seed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const url = `https://${slug}.example.test`;

    return {
      id: `${towerId}-${String(index + 1).padStart(2, "0")}`,
      towerId,
      entityType,
      normalizedUrl: url,
      url,
      name: seed.name,
      description: seed.description,
      logoUrl: seed.logoUrl ?? null,
      category: seed.category,
      location: seed.location ?? null,
      hiring: seed.hiring ?? false,
      totalPaidMinor: seed.totalPaidMinor,
      currency: "USD",
      claimedAt: new Date(Date.UTC(2026, 0, index + 1, 9, 0)).toISOString(),
    };
  });
}

const generatedCategories = ["Technology", "Creative", "Climate", "Commerce", "Infrastructure", "Community"] as const;
const generatedLocations = ["Mumbai", "Toronto", "Lisbon", "Singapore", "Berlin", "Nairobi"] as const;

/** Deterministic Phase 2 demo inventory; each seed becomes exactly one ranked floor. */
export function createDemoSeeds(prefix: string, count: number, startingPaidMinor: number): MockListingSeed[] {
  return Array.from({ length: count }, (_, index) => ({
    name: `${prefix} ${String(index + 1).padStart(2, "0")}`,
    totalPaidMinor: Math.max(100, startingPaidMinor - index * 430),
    category: generatedCategories[index % generatedCategories.length],
    location: generatedLocations[index % generatedLocations.length],
    hiring: index % 5 === 1,
    description: `Original ${prefix.toLowerCase()} building practical tools for ambitious teams.`,
  }));
}
