import { CanvasTexture, SRGBColorSpace } from "three";
import type { Listing } from "@/domain/listing";
import { formatMinorUnits } from "@/domain/money";
import { tokens } from "@/design/tokens";

export const MAX_CACHED_SIGNS = 24;
export const MAX_FOCUSED_SIGNS = 9;
const cache = new Map<string, CanvasTexture>();

export function floorSignCacheSize(): number { return cache.size; }
export function isSafeLogoUrl(url: string): boolean { return url.startsWith("/") || url.startsWith("data:image/"); }

function ellipsis(context: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (context.measureText(text).width <= maxWidth) return text;
  let value = text;
  while (value.length > 1 && context.measureText(`${value}…`).width > maxWidth) value = value.slice(0, -1);
  return `${value}…`;
}

function drawSign(context: CanvasRenderingContext2D, listing: Listing, logo?: CanvasImageSource) {
  const gold = listing.rank === 1;
  context.clearRect(0, 0, 1536, 384);
  context.fillStyle = tokens.color.brand.navy; context.fillRect(0, 0, 1536, 384);
  const gradient = context.createLinearGradient(0, 0, 1536, 384);
  gradient.addColorStop(0, gold ? tokens.color.brand.summitGold : tokens.color.brand.blue);
  gradient.addColorStop(1, tokens.color.brand.navy);
  context.globalAlpha = gold ? 0.22 : 0.32;
  context.fillStyle = gradient; context.fillRect(0, 0, 1536, 384);
  context.globalAlpha = 1;
  context.fillStyle = gold ? tokens.color.brand.summitGold : tokens.color.brand.blue;
  context.fillRect(0, 0, 14, 384); context.fillRect(14, 0, 1522, 7);
  context.fillStyle = tokens.color.brand.softWhite;
  context.beginPath(); context.roundRect(38, 55, 218, 274, 34); context.fill();
  if (logo) {
    const image = logo as HTMLImageElement;
    const width = image.naturalWidth || 180, height = image.naturalHeight || 180;
    const scale = Math.min(178 / width, 224 / height);
    context.drawImage(logo, 147 - width * scale / 2, 192 - height * scale / 2, width * scale, height * scale);
  } else {
    const initials = listing.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("");
    context.fillStyle = tokens.color.brand.navy;
    context.font = "800 108px Inter, system-ui, sans-serif";
    context.textAlign = "center"; context.textBaseline = "middle";
    context.fillText(initials, 147, 194, 170);
  }
  context.textAlign = "left"; context.textBaseline = "alphabetic";
  context.fillStyle = tokens.color.brand.white;
  context.font = "800 78px Inter, system-ui, sans-serif";
  context.fillText(ellipsis(context, listing.name, 790), 292, 145);
  context.fillStyle = tokens.color.brand.lightBlue;
  context.font = "500 39px Inter, system-ui, sans-serif";
  context.fillText(ellipsis(context, listing.description, 790), 292, 215);
  context.fillStyle = gold ? tokens.color.brand.summitGold : tokens.color.brand.white;
  context.font = "800 72px Inter, system-ui, sans-serif";
  context.fillText(`#${listing.rank}`, 1230, 125, 260);
  context.font = "800 62px Inter, system-ui, sans-serif";
  context.fillText(formatMinorUnits(listing.totalPaidMinor), 1230, 205, 280);
  if (listing.hiring) {
    context.fillStyle = tokens.color.brand.teal; context.beginPath(); context.roundRect(292, 256, 205, 70, 18); context.fill();
    context.fillStyle = tokens.color.brand.navy; context.font = "800 35px Inter, system-ui, sans-serif"; context.fillText("HIRING", 326, 304);
  }
}

/** Bounded Canvas media cache. Arbitrary remote URLs are intentionally not loaded. */
export function createFloorSignTexture(listing: Listing): CanvasTexture {
  const key = [listing.id, listing.rank, listing.name, listing.description, listing.totalPaidMinor, listing.hiring, listing.logoUrl].join("|");
  const existing = cache.get(key);
  if (existing) { cache.delete(key); cache.set(key, existing); return existing; }
  const canvas = document.createElement("canvas"); canvas.width = 1536; canvas.height = 384;
  const context = canvas.getContext("2d");
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4;
  if (context) {
    drawSign(context, listing);
    if (listing.logoUrl && isSafeLogoUrl(listing.logoUrl)) {
      const image = new Image();
      image.onload = () => { drawSign(context, listing, image); texture.needsUpdate = true; };
      image.onerror = () => { drawSign(context, listing); texture.needsUpdate = true; };
      image.src = listing.logoUrl;
    }
  }
  cache.set(key, texture);
  while (cache.size > MAX_CACHED_SIGNS) {
    const oldest = cache.keys().next().value as string | undefined;
    if (!oldest) break;
    cache.get(oldest)?.dispose(); cache.delete(oldest);
  }
  return texture;
}

export function visibleFloorSigns(listings: readonly Listing[], selectedListingId: string | null, focused: boolean, focusedRank?: number): Listing[] {
  if (!focused) return listings.filter((listing) => listing.rank === 1);
  const selected = listings.find((listing) => listing.id === selectedListingId);
  const centerRank = focusedRank ?? selected?.rank ?? 1;
  const radius = selected ? 2 : 4;
  return listings.filter((listing) => Math.abs(listing.rank - centerRank) <= radius).slice(0, MAX_FOCUSED_SIGNS);
}
