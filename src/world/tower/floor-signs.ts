import { CanvasTexture, SRGBColorSpace } from "three";
import type { Listing } from "@/domain/listing";
import { formatMinorUnits } from "@/domain/money";
import { tokens } from "@/design/tokens";
import { FLOOR_HEIGHT } from "@/world/tower/tower-layout";

export type FloorMediaRole = "primary" | "brand" | "status" | "logo";
export type FloorFace = "front" | "left" | "right";
export type FloorMediaContent = Pick<Listing, "id" | "name" | "description" | "logoUrl" | "rank" | "totalPaidMinor" | "hiring">;
export const MAX_CACHED_SIGNS = 56;
export const MAX_FOCUSED_SIGNS = 9;

/** Ratios belong to advertising, never to the approved wing mesh. */
export const FLOOR_ADVERTISING = {
  facadeHeightRatio: 0.72,
  horizontalInsetRatio: 0.04,
  surfaceOffset: 0.012,
  logoSizeRatio: 0.46,
  logoInternalPaddingRatio: 0.18,
  logoDepth: 0.015,
  selectionEdge: 0.018,
  primaryTextureWidth: 1024,
  compactTextureWidth: 512,
  logoTextureWidth: 256,
} as const;

// These match the existing Floor.tsx glazing instances. The inner portion of a
// side wing joins the Y core and is not a usable media surface.
const WING_FACE = {
  frontWidth: 1.31,
  frontRadius: 2.43,
  sideWidth: 2.07,
  sideX: 0.73,
  sideStart: 1.12,
  sideEnd: 2.25,
  clearHeight: FLOOR_HEIGHT * 0.84,
} as const;

export interface FloorFacadeRole { wing: 0 | 1 | 2; face: FloorFace; role: Exclude<FloorMediaRole, "logo"> }
/** One full identity; adjacent faces continue brand or show performance only. */
export const FLOOR_FACADE_ROLES: readonly FloorFacadeRole[] = [
  { wing: 0, face: "front", role: "primary" },
  { wing: 0, face: "left", role: "brand" },
  { wing: 0, face: "right", role: "status" },
  { wing: 1, face: "front", role: "brand" },
  { wing: 1, face: "left", role: "status" },
  { wing: 1, face: "right", role: "brand" },
  { wing: 2, face: "front", role: "brand" },
  { wing: 2, face: "left", role: "status" },
  { wing: 2, face: "right", role: "brand" },
] as const;

export function floorFacadeDimensions(face: FloorFace, footprint: number) {
  const usableWidth = face === "front" ? WING_FACE.frontWidth : WING_FACE.sideEnd - WING_FACE.sideStart;
  return {
    width: usableWidth * footprint * (1 - 2 * FLOOR_ADVERTISING.horizontalInsetRatio),
    height: WING_FACE.clearHeight * FLOOR_ADVERTISING.facadeHeightRatio,
    frontZ: WING_FACE.frontRadius * footprint + 0.0175 + FLOOR_ADVERTISING.surfaceOffset,
    sideX: WING_FACE.sideX * footprint + 0.0175 + FLOOR_ADVERTISING.surfaceOffset,
    sideZ: (WING_FACE.sideStart + WING_FACE.sideEnd) / 2 * footprint,
    innerEnd: WING_FACE.sideStart * footprint,
    outerEnd: WING_FACE.sideEnd * footprint,
  };
}

export function floorFaceListingId(listing: Pick<FloorMediaContent, "id">, face: FloorFacadeRole): string {
  void face;
  return listing.id;
}

function textureWidth(role: FloorMediaRole): number {
  return role === "primary" ? FLOOR_ADVERTISING.primaryTextureWidth : role === "logo" ? FLOOR_ADVERTISING.logoTextureWidth : FLOOR_ADVERTISING.compactTextureWidth;
}
export function floorSignCanvasHeight(role: FloorMediaRole, footprint = 1, face: FloorFace = "front"): number {
  if (role === "logo") return FLOOR_ADVERTISING.logoTextureWidth;
  const bay = floorFacadeDimensions(face, footprint);
  return Math.round(textureWidth(role) * bay.height / bay.width);
}

const cache = new Map<string, CanvasTexture>();
export function floorSignCacheSize(): number { return cache.size; }
export function isSafeLogoUrl(url: string): boolean { return url.startsWith("/") && !url.startsWith("//") || /^data:image\/(png|jpeg|webp);base64,/i.test(url); }
export function initialsForName(name: string): string { return name.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase(); }

/** Shrink a single field before ellipsis; no other column moves. */
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

/** Use two balanced lines only when a normal one-line name would become tiny. */
export function fitPrimaryName(context: Pick<CanvasRenderingContext2D, "font" | "measureText">, value: string, maxWidth: number) {
  const single = fitText(context, value, maxWidth, 112, 62);
  if (single.size >= 90 && !single.truncated) return { lines: [single], multiline: false };
  const words = value.trim().split(/\s+/);
  if (words.length < 2) return { lines: [single], multiline: false };
  let best: { lines: ReturnType<typeof fitText>[]; score: number } | null = null;
  for (let split = 1; split < words.length; split++) {
    const first = fitText(context, words.slice(0, split).join(" "), maxWidth, 112, 70);
    const second = fitText(context, words.slice(split).join(" "), maxWidth, 112, 70);
    if (first.truncated || second.truncated) continue;
    const score = Math.min(first.size, second.size) * 10 - Math.abs(first.size - second.size);
    if (!best || score > best.score) best = { lines: [first, second], score };
  }
  return best ? { lines: best.lines, multiline: true } : { lines: [single], multiline: false };
}

function drawLogo(context: CanvasRenderingContext2D, content: FloorMediaContent, logo?: HTMLImageElement) {
  const size = FLOOR_ADVERTISING.logoTextureWidth;
  context.fillStyle = tokens.color.brand.softWhite;
  context.beginPath(); context.roundRect(0, 0, size, size, size * 0.18); context.fill();
  const padding = size * FLOOR_ADVERTISING.logoInternalPaddingRatio;
  if (logo) {
    const width = logo.naturalWidth || 1, height = logo.naturalHeight || 1;
    const scale = Math.min((size - padding * 2) / width, (size - padding * 2) / height);
    context.drawImage(logo, (size - width * scale) / 2, (size - height * scale) / 2, width * scale, height * scale);
  } else {
    context.textAlign = "center"; context.textBaseline = "middle";
    context.fillStyle = tokens.color.brand.navy; context.font = "800 112px Inter, system-ui, sans-serif";
    context.fillText(initialsForName(content.name), size / 2, size / 2, size - padding * 2);
  }
}

export function drawFloorMedia(context: CanvasRenderingContext2D, content: FloorMediaContent, role: FloorMediaRole, footprint = 1, face: FloorFace = "front", logo?: HTMLImageElement) {
  const width = textureWidth(role), height = floorSignCanvasHeight(role, footprint, face), center = height / 2;
  context.clearRect(0, 0, width, height);
  if (role === "logo") { drawLogo(context, content, logo); return; }
  context.textBaseline = "middle";
  const gold = content.rank === 1;
  if (role === "primary") {
    // The short wing face keeps identity legible; its side bay owns statistics.
    const logoSpace = height * FLOOR_ADVERTISING.logoSizeRatio;
    const textX = 48 + logoSpace + 36;
    const textWidth = width - textX - 48;
    const name = fitPrimaryName(context, content.name, textWidth);
    context.fillStyle = tokens.color.brand.white;
    name.lines.forEach((line, index) => {
      context.font = `800 ${line.size}px Inter, system-ui, sans-serif`;
      context.fillText(line.text, textX, name.multiline ? center - 66 + index * 70 : center - 38);
    });
    if (content.description) {
      const detail = fitText(context, content.description, textWidth, 48, 28, 500);
      context.fillStyle = tokens.color.brand.lightBlue; context.font = `500 ${detail.size}px Inter, system-ui, sans-serif`;
      context.fillText(detail.text, textX, center + (name.multiline ? 74 : 35));
    }
    if (content.hiring) drawHiring(context, textX, center + (name.multiline ? 118 : 86));
    return;
  }
  if (role === "brand") {
    const name = fitText(context, content.name, width - 72, 64, 38);
    context.fillStyle = tokens.color.brand.white; context.font = `800 ${name.size}px Inter, system-ui, sans-serif`;
    context.fillText(name.text, 36, center);
    return;
  }
  context.fillStyle = gold ? tokens.color.brand.summitGold : tokens.color.brand.white;
  context.textAlign = "right";
  context.font = "800 56px Inter, system-ui, sans-serif";
  context.fillText(`#${content.rank}`, width - 36, center - 34);
  const amount = fitText(context, formatMinorUnits(content.totalPaidMinor), width - 72, 62, 46);
  context.font = `800 ${amount.size}px Inter, system-ui, sans-serif`;
  context.fillText(amount.text, width - 36, center + 38);
}

function drawHiring(context: CanvasRenderingContext2D, x: number, y: number) {
  context.textAlign = "left"; context.fillStyle = tokens.color.brand.teal;
  context.beginPath(); context.roundRect(x, y - 18, 142, 37, 8); context.fill();
  context.fillStyle = tokens.color.brand.navy; context.font = "800 21px Inter, system-ui, sans-serif";
  context.fillText("HIRING", x + 20, y + 1);
}

export function createFloorSignTexture(content: FloorMediaContent, role: FloorMediaRole, footprint = 1, face: FloorFace = "front"): CanvasTexture {
  const key = [content.id, role, face, footprint.toFixed(3), content.rank, content.name, content.description, content.totalPaidMinor, content.hiring, content.logoUrl].join("|");
  const existing = cache.get(key);
  if (existing) { cache.delete(key); cache.set(key, existing); return existing; }
  const canvas = document.createElement("canvas"); canvas.width = textureWidth(role); canvas.height = floorSignCanvasHeight(role, footprint, face);
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
    drawFloorMedia(context, content, role, footprint, face);
    if (document.fonts) void document.fonts.ready.then(() => { drawFloorMedia(context, content, role, footprint, face, loadedLogo); texture.needsUpdate = true; });
    if (role === "logo" && content.logoUrl && isSafeLogoUrl(content.logoUrl)) {
      const image = new Image();
      image.onload = () => { loadedLogo = image; drawFloorMedia(context, content, role, footprint, face, image); texture.needsUpdate = true; };
      image.onerror = () => { drawFloorMedia(context, content, role, footprint, face); texture.needsUpdate = true; };
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
