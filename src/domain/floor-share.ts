import type { Listing } from "./listing";
import type { TowerId } from "./tower";

/** Stable listing identity, not a promise that today's rank is permanent. */
export function floorShareUrl(base: string, listing: Pick<Listing, "id" | "towerId">): string {
  const current = new URL(base), url = new URL(current.pathname, current.origin);
  if (current.searchParams.get("regression") === "legacy") url.searchParams.set("regression", "legacy");
  url.searchParams.set("tower", listing.towerId); url.searchParams.set("floor", listing.id);
  return url.toString();
}
export function resolveSharedFloor(search: string, inventory: Record<TowerId, readonly Listing[]>): Listing | null {
  const params = new URLSearchParams(search), tower = params.get("tower"), id = params.get("floor");
  if (!tower || !["companies", "products", "people"].includes(tower) || !id) return null;
  return inventory[tower as TowerId].find(listing => listing.id === id) ?? null;
}
