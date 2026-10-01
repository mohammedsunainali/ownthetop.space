import { CanvasTexture, SRGBColorSpace } from "three";
import type { Listing } from "@/domain/listing";
import { formatMinorUnits } from "@/domain/money";
import { tokens } from "@/design/tokens";

const MAX_CACHED_SIGNS = 24;
const cache = new Map<string, CanvasTexture>();

export function floorSignCacheSize(): number { return cache.size; }

/** Canvas media is created only for nearby/selected listings, never per frame. */
export function createFloorSignTexture(listing: Listing): CanvasTexture {
  const key = [listing.id, listing.rank, listing.name, listing.description, listing.totalPaidMinor, listing.hiring].join("|");
  const existing = cache.get(key);
  if (existing) { cache.delete(key); cache.set(key, existing); return existing; }
  const canvas = document.createElement("canvas");
  canvas.width = 1024; canvas.height = 256;
  const context = canvas.getContext("2d");
  if (context) {
    const gold = listing.rank === 1;
    context.fillStyle = tokens.color.brand.navy; context.fillRect(0, 0, 1024, 256);
    context.fillStyle = gold ? tokens.color.brand.summitGold : tokens.color.brand.blue;
    context.fillRect(0, 0, 12, 256); context.fillRect(12, 0, 1012, 5);
    context.fillStyle = tokens.color.brand.white;
    context.font = "bold 75px Arial"; context.fillText(listing.name.slice(0, 23), 114, 101, 625);
    context.font = "40px Arial"; context.fillText(listing.description.slice(0, 48), 114, 159, 620);
    context.fillStyle = gold ? tokens.color.brand.summitGold : tokens.color.brand.lightBlue;
    context.font = "bold 66px Arial"; context.fillText(`#${listing.rank}`, 770, 89);
    context.font = "bold 50px Arial"; context.fillText(formatMinorUnits(listing.totalPaidMinor), 770, 159, 230);
    context.fillStyle = tokens.color.brand.white; context.font = "bold 56px Arial";
    context.fillText(listing.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join(""), 30, 104);
    if (listing.hiring) { context.font = "bold 32px Arial"; context.fillText("HIRING", 780, 222); }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  cache.set(key, texture);
  while (cache.size > MAX_CACHED_SIGNS) {
    const oldest = cache.keys().next().value;
    if (!oldest) break;
    cache.get(oldest)?.dispose(); cache.delete(oldest);
  }
  return texture;
}

export function visibleFloorSigns(listings: readonly Listing[], selectedListingId: string | null, focused: boolean, focusedRank?: number): Listing[] {
  if (!focused) return listings.filter((listing) => listing.rank <= 1);
  const selected = listings.find((listing) => listing.id === selectedListingId);
  const centerRank = focusedRank ?? selected?.rank ?? 1;
  return listings.filter((listing) => Math.abs(listing.rank - centerRank) <= 2);
}
