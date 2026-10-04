import { CanvasTexture, SRGBColorSpace } from "three";
import type { Listing } from "@/domain/listing";
import { formatMinorUnits } from "@/domain/money";
import { tokens } from "@/design/tokens";

export type FloorMediaLayout = "wide" | "compact";
export type FloorMediaContent = Pick<Listing, "id" | "name" | "description" | "logoUrl" | "rank" | "totalPaidMinor" | "hiring">;
export const MAX_CACHED_SIGNS = 24;
export const MAX_FOCUSED_SIGNS = 9;
export const FACADE_METRICS = {
  wide: { width: 1536, height: 384, logoX: 38, logoY: 55, logoWidth: 218, logoHeight: 274, textX: 292, textWidth: 790, rankX: 1230, rankWidth: 270 },
  compact: { width: 1280, height: 512, logoX: 30, logoY: 110, logoWidth: 206, logoHeight: 292, textX: 266, textWidth: 676, rankX: 1000, rankWidth: 245 },
} as const;
const cache = new Map<string, CanvasTexture>();

export function floorSignCacheSize(): number { return cache.size; }
export function isSafeLogoUrl(url: string): boolean { return url.startsWith("/") && !url.startsWith("//") || /^data:image\/(png|jpeg|webp);base64,/i.test(url); }

/** Reduce type to a defined minimum, then and only then truncate. */
export function fitText(context: Pick<CanvasRenderingContext2D, "font" | "measureText">, value: string, maxWidth: number, preferredSize: number, minimumSize: number, weight = 800): { text: string; size: number; truncated: boolean } {
  let size = preferredSize;
  while (size > minimumSize) {
    context.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
    if (context.measureText(value).width <= maxWidth) return { text: value, size, truncated: false };
    size = Math.max(minimumSize, size - 2);
  }
  context.font = `${weight} ${minimumSize}px Inter, system-ui, sans-serif`;
  if (context.measureText(value).width <= maxWidth) return { text: value, size: minimumSize, truncated: false };
  let fitted = value;
  while (fitted.length > 1 && context.measureText(`${fitted}…`).width > maxWidth) fitted = fitted.slice(0, -1);
  return { text: `${fitted}…`, size: minimumSize, truncated: true };
}

export function fitWideNameLines(context: Pick<CanvasRenderingContext2D, "font" | "measureText">, value: string, maxWidth: number): { lines: string[]; size: number } {
  const single = fitText(context, value, maxWidth, 78, 54);
  if (!single.truncated) return { lines: [single.text], size: single.size };
  const words = value.split(/\s+/);
  for (let split = 1; split < words.length; split++) {
    const first = words.slice(0, split).join(" "), second = words.slice(split).join(" ");
    const left = fitText(context, first, maxWidth, 64, 54);
    const right = fitText(context, second, maxWidth, 64, 54);
    if (!left.truncated && !right.truncated) return { lines: [first, second], size: Math.min(left.size, right.size) };
  }
  return { lines: [single.text], size: single.size };
}

function drawLogo(context: CanvasRenderingContext2D, content: FloorMediaContent, layout: FloorMediaLayout, logo?: HTMLImageElement) {
  const m = FACADE_METRICS[layout];
  context.fillStyle = tokens.color.brand.softWhite;
  context.beginPath(); context.roundRect(m.logoX, m.logoY, m.logoWidth, m.logoHeight, 32); context.fill();
  if (logo) {
    const width = logo.naturalWidth || 180, height = logo.naturalHeight || 180;
    const scale = Math.min((m.logoWidth - 36) / width, (m.logoHeight - 36) / height);
    context.drawImage(logo, m.logoX + (m.logoWidth - width * scale) / 2, m.logoY + (m.logoHeight - height * scale) / 2, width * scale, height * scale);
  } else {
    const initials = content.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("");
    context.fillStyle = tokens.color.brand.navy; context.font = "800 104px Inter, system-ui, sans-serif";
    context.textAlign = "center"; context.textBaseline = "middle";
    context.fillText(initials, m.logoX + m.logoWidth / 2, m.logoY + m.logoHeight / 2, m.logoWidth - 24);
  }
}

export function drawFloorMedia(context: CanvasRenderingContext2D, content: FloorMediaContent, layout: FloorMediaLayout, footprint = 1, logo?: HTMLImageElement) {
  const base = FACADE_METRICS[layout];
  const m = { ...base, height: Math.round(base.height / footprint) };
  const gold = content.rank === 1;
  context.clearRect(0, 0, m.width, m.height);
  context.fillStyle = tokens.color.brand.navy; context.fillRect(0, 0, m.width, m.height);
  const gradient = context.createLinearGradient(0, 0, m.width, m.height);
  gradient.addColorStop(0, gold ? tokens.color.brand.summitGold : tokens.color.brand.blue);
  gradient.addColorStop(1, tokens.color.brand.navy);
  context.globalAlpha = gold ? 0.22 : 0.32;
  context.fillStyle = gradient; context.fillRect(0, 0, m.width, m.height);
  context.globalAlpha = 1;
  context.fillStyle = gold ? tokens.color.brand.summitGold : tokens.color.brand.blue;
  context.fillRect(0, 0, 14, m.height); context.fillRect(14, 0, m.width - 14, 7);
  context.save();
  context.translate(0, (m.height - base.height) / 2);
  drawLogo(context, content, layout, logo);
  context.textAlign = "left"; context.textBaseline = "alphabetic";
  const compact = layout === "compact";
  const name = compact ? fitText(context, content.name, m.textWidth, 70, 34) : null;
  const wideName = compact ? null : fitWideNameLines(context, content.name, m.textWidth);
  context.fillStyle = tokens.color.brand.white;
  context.font = `800 ${compact ? name!.size : wideName!.size}px Inter, system-ui, sans-serif`;
  if (compact) context.fillText(name!.text, m.textX, 208);
  else wideName!.lines.forEach((line, index) => context.fillText(line, m.textX, wideName!.lines.length === 2 ? 115 + index * 65 : 145));
  const subtitle = fitText(context, content.description, m.textWidth, compact ? 41 : 39, compact ? 28 : 27, 500);
  context.fillStyle = tokens.color.brand.lightBlue;
  context.font = `500 ${subtitle.size}px Inter, system-ui, sans-serif`;
  context.fillText(subtitle.text, m.textX, compact ? 285 : wideName!.lines.length === 2 ? 243 : 215);
  context.fillStyle = gold ? tokens.color.brand.summitGold : tokens.color.brand.white;
  const rank = fitText(context, `#${content.rank}`, m.rankWidth, 72, 48);
  context.font = `800 ${rank.size}px Inter, system-ui, sans-serif`;
  context.fillText(rank.text, m.rankX, compact ? 195 : 125);
  const amount = fitText(context, formatMinorUnits(content.totalPaidMinor), m.rankWidth, compact ? 58 : 62, 40);
  context.font = `800 ${amount.size}px Inter, system-ui, sans-serif`;
  context.fillText(amount.text, m.rankX, compact ? 286 : 205);
  if (content.hiring) {
    const x = m.textX, y = compact ? 340 : wideName!.lines.length === 2 ? 274 : 256;
    context.fillStyle = tokens.color.brand.teal; context.beginPath(); context.roundRect(x, y, 205, 70, 18); context.fill();
    context.fillStyle = tokens.color.brand.navy; context.font = "800 35px Inter, system-ui, sans-serif";
    context.fillText("HIRING", x + 34, y + 48);
  }
  context.restore();
}

/** Both face orientations use the same media content and a bounded texture cache. */
export function createFloorSignTexture(content: FloorMediaContent, layout: FloorMediaLayout = "wide", footprint = 1): CanvasTexture {
  const key = [content.id, layout, footprint.toFixed(3), content.rank, content.name, content.description, content.totalPaidMinor, content.hiring, content.logoUrl].join("|");
  const existing = cache.get(key);
  if (existing) { cache.delete(key); cache.set(key, existing); return existing; }
  const m = FACADE_METRICS[layout];
  const canvas = document.createElement("canvas"); canvas.width = m.width; canvas.height = Math.round(m.height / footprint);
  const context = canvas.getContext("2d");
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4;
  cache.set(key, texture);
  while (cache.size > MAX_CACHED_SIGNS) {
    const oldest = cache.keys().next().value as string | undefined;
    if (!oldest) break;
    cache.get(oldest)?.dispose(); cache.delete(oldest);
  }
  if (context) {
    let loadedLogo: HTMLImageElement | undefined;
    drawFloorMedia(context, content, layout, footprint);
    if (document.fonts) void document.fonts.ready.then(() => { drawFloorMedia(context, content, layout, footprint, loadedLogo); texture.needsUpdate = true; });
    if (content.logoUrl && isSafeLogoUrl(content.logoUrl)) {
      const image = new Image();
      image.onload = () => { loadedLogo = image; drawFloorMedia(context, content, layout, footprint, image); texture.needsUpdate = true; };
      image.onerror = () => { drawFloorMedia(context, content, layout, footprint); texture.needsUpdate = true; };
      image.src = content.logoUrl;
    }
  }
  return texture;
}

export function releaseFloorSignTexture(id: string): void {
  for (const [key, texture] of cache) if (key.startsWith(`${id}|`)) { texture.dispose(); cache.delete(key); }
}

export function visibleFloorSigns(listings: readonly Listing[], selectedListingId: string | null, focused: boolean, focusedRank?: number): Listing[] {
  if (!focused) return listings.filter((listing) => listing.rank === 1);
  const selected = listings.find((listing) => listing.id === selectedListingId);
  const centerRank = focusedRank ?? selected?.rank ?? 1;
  const radius = selected ? 2 : 4;
  return listings.filter((listing) => Math.abs(listing.rank - centerRank) <= radius).slice(0, MAX_FOCUSED_SIGNS);
}
