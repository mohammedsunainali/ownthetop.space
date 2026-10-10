import { describe, expect, it } from "vitest";
import { companies, people, products } from "@/mock";
import { getFloorY } from "@/world/tower/tower-layout";

describe("Phase 1 mock world", () => {
  it("contains the required stable listing counts", () => {
    expect(companies).toHaveLength(50);
    expect(products).toHaveLength(20);
    expect(people).toHaveLength(20);
    expect(companies.length + products.length + people.length).toBe(90);
  });

  it.each([
    ["companies", companies],
    ["products", products],
    ["people", people],
  ] as const)("places rank one at the highest physical floor in %s", (_, listings) => {
    const top = listings.find((listing) => listing.rank === 1);
    const otherY = listings.filter((listing) => listing.rank !== 1).map((listing) => getFloorY(listing.rank, listings.length));

    expect(top).toBeDefined();
    expect(getFloorY(top!.rank, listings.length)).toBeGreaterThan(Math.max(...otherY));
  });
});
