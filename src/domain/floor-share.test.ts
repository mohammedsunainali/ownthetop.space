import { expect, it } from "vitest";
import { phase3Listings } from "@/mock/phase-3-fixture";
import { floorShareUrl, resolveSharedFloor } from "./floor-share";
it("round-trips the exact listing and category without claiming a rank/payment", () => {
  const listing = phase3Listings.companies[11], url = new URL(floorShareUrl("https://example.test/?diagnostics=1", listing));
  expect(resolveSharedFloor(url.search, phase3Listings)).toBe(listing);
  expect(url.searchParams.has("diagnostics")).toBe(false); expect(url.searchParams.has("paid")).toBe(false);
  expect(resolveSharedFloor(`?tower=products&floor=${listing.id}`, phase3Listings)).toBeNull();
  expect(resolveSharedFloor("?tower=__proto__&floor=anything", phase3Listings)).toBeNull();
});
it("preserves an explicit legacy inventory but not preview or unrelated query state", () => {
  const url = new URL(floorShareUrl("https://example.test/?regression=legacy&preview=1", phase3Listings.people[0]));
  expect(url.searchParams.get("regression")).toBe("legacy"); expect(url.searchParams.has("preview")).toBe(false);
});
