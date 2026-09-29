import { describe, expect, it } from "vitest";
import type { TowerId } from "@/domain/tower";
import type { UnrankedListing } from "@/domain/listing";
import { rankListings } from "@/lib/ranking/rank-listings";

function fixture(
  name: string,
  totalPaidMinor: number,
  claimedAt = "2026-01-01T10:00:00.000Z",
  towerId: TowerId = "companies",
): UnrankedListing {
  return {
    id: `${towerId}-${name.toLowerCase()}`,
    towerId,
    entityType: towerId === "people" ? "person" : towerId === "products" ? "product" : "company",
    normalizedUrl: `https://example.test/${name.toLowerCase()}`,
    url: `https://example.test/${name.toLowerCase()}`,
    name,
    description: `${name} fixture`,
    logoUrl: null,
    category: "Fixture",
    location: null,
    hiring: false,
    totalPaidMinor,
    currency: "USD",
    claimedAt,
  };
}

function namesByRank(listings: ReturnType<typeof rankListings>): string[] {
  return listings.slice().sort((a, b) => a.rank - b.rank).map((listing) => listing.name);
}

describe("rankListings", () => {
  const original = [fixture("A", 100), fixture("B", 500), fixture("C", 1000), fixture("D", 700)];

  it("orders cumulative totals descending", () => {
    expect(namesByRank(rankListings(original))).toEqual(["C", "D", "B", "A"]);
  });

  it("moves an upgraded cumulative total to the top", () => {
    const upgraded = original.map((listing) =>
      listing.name === "B" ? { ...listing, totalPaidMinor: 1100 } : listing,
    );
    expect(namesByRank(rankListings(upgraded))).toEqual(["B", "C", "D", "A"]);
  });

  it("uses earliest claim time as the tie breaker", () => {
    const tied = [
      fixture("A", 1000, "2026-01-01T10:00:00.000Z"),
      fixture("B", 1000, "2026-01-01T10:05:00.000Z"),
    ];
    expect(namesByRank(rankListings(tied))).toEqual(["A", "B"]);
  });

  it("ranks each tower independently", () => {
    const ranked = rankListings([
      fixture("Company A", 100),
      fixture("Company B", 500),
      fixture("Product A", 2000, undefined, "products"),
      fixture("Product B", 3000, undefined, "products"),
    ]);
    expect(ranked.find((listing) => listing.name === "Company B")?.rank).toBe(1);
    expect(ranked.find((listing) => listing.name === "Product B")?.rank).toBe(1);
  });

  it("does not mutate the input array or objects", () => {
    const input = original.map((listing) => Object.freeze({ ...listing }));
    const snapshot = JSON.stringify(input);
    const ranked = rankListings(Object.freeze(input));

    expect(JSON.stringify(input)).toBe(snapshot);
    expect(ranked).not.toBe(input);
    ranked.forEach((listing, index) => expect(listing).not.toBe(input[index]));
  });

  it("returns consecutive ranks beginning at one per tower", () => {
    const ranked = rankListings([
      ...original,
      fixture("P1", 100, undefined, "products"),
      fixture("P2", 300, undefined, "products"),
    ]);

    for (const towerId of ["companies", "products"] as const) {
      const ranks = ranked
        .filter((listing) => listing.towerId === towerId)
        .map((listing) => listing.rank)
        .sort((a, b) => a - b);
      expect(ranks).toEqual(Array.from({ length: ranks.length }, (_, index) => index + 1));
    }
  });
});
