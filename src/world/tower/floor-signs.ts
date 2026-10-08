import { CanvasTexture, MeshStandardMaterial, SRGBColorSpace } from "three";
import type { Listing } from "@/domain/listing";
import { formatMinorUnits } from "@/domain/money";
import { tokens } from "@/design/tokens";
import { FLOOR_HEIGHT } from "@/world/tower/tower-layout";

export type FloorMediaRole = "nose" | "wing" | "logo";
export type FloorFace = "front" | "left" | "right";
export type FloorMediaContent = Pick<Listing, "id" | "name" | "description" | "logoUrl" | "rank" | "totalPaidMinor" | "hiring">;
export const MAX_CACHED_SIGNS = 56;
export const MAX_FOCUSED_SIGNS = 9;
export const SIGN_FONT_FAMILY = "Montserrat, system-ui, sans-serif";
let hiringSignMaterial: MeshStandardMaterial | null = null;

export function getHiringSignMaterial(): MeshStandardMaterial {
  if (hiringSignMaterial) return hiringSignMaterial;
  const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 152;
  const context = canvas.getContext("2d");
  const paint = () => {
    if (!context) return;
    context.fillStyle = tokens.color.brand.teal;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = tokens.color.brand.white;
    context.textAlign = "center"; context.textBaseline = "middle";
    context.font = `800 86px ${SIGN_FONT_FAMILY}`;
    context.fillText("HIRING", canvas.width / 2, canvas.height / 2, canvas.width * 0.84);
  };
  paint();
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4;
  hiringSignMaterial = new MeshStandardMaterial({ map: texture, color: tokens.color.brand.white, roughness: 0.46, metalness: 0.08, emissive: tokens.color.brand.teal, emissiveIntensity: 0.08 });
  if (document.fonts) void document.fonts.load("800 86px Montserrat").then(() => { paint(); texture.needsUpdate = true; }).catch(() => { /* Keep fallback lettering visible. */ });
  return hiringSignMaterial;
}

/** Ratios belong to advertising, never to the approved wing mesh. */
export const FLOOR_ADVERTISING = {
  facadeHeightRatio: 0.76,
  horizontalInsetRatio: 0.04,
  centerSeamInsetRatio: 0.12,
  surfaceOffset: 0.010,
  noseLogoSizeRatio: 0.55,
  logoSizeRatio: 0.50,
  logoInternalPaddingRatio: 0.10,
  logoDepth: 0.014,
  selectionEdge: 0.014,
  wingTextureWidth: 1536,
  noseTextureWidth: 512,
  logoTextureWidth: 256,
} as const;

// Exact existing wing/glazing geometry. The media measures these faces; the
// approved tower footprint, slabs, elevations and taper do not change.
export const WING_FACE = {
  frontWidth: 1.31,
  frontRadius: 2.43,
  sideWidth: 2.07,
  sideX: 0.73,
  sideCenter: 1.27,
  clearHeight: FLOOR_HEIGHT * 0.84,
} as const;

export interface FloorFacadeRole { wing: 0 | 1 | 2; face: FloorFace; role: Exclude<FloorMediaRole, "logo"> }
/** One nose brand anchor and two independent complete V-wing advertisements. */
export const FLOOR_FACADE_ROLES: readonly FloorFacadeRole[] = ([0, 1, 2] as const).flatMap((wing) => [
  { wing, face: "front" as const, role: "nose" as const },
  { wing, face: "left" as const, role: "wing" as const },
  { wing, face: "right" as const, role: "wing" as const },
]);

export function floorFacadeDimensions(face: FloorFace, footprint: number) {
  const sideInner = WING_FACE.sideCenter - WING_FACE.sideWidth / 2;
  const sideOuter = WING_FACE.sideCenter + WING_FACE.sideWidth / 2;
  const sideStart = sideInner + WING_FACE.sideWidth * FLOOR_ADVERTISING.centerSeamInsetRatio;
  const sideEnd = sideOuter - WING_FACE.sideWidth * FLOOR_ADVERTISING.horizontalInsetRatio;
  const usableWidth = face === "front" ? WING_FACE.frontWidth : sideEnd - sideStart;
  return {
    width: usableWidth * footprint * (face === "front" ? 1 - 2 * FLOOR_ADVERTISING.horizontalInsetRatio : 1),
    height: WING_FACE.clearHeight * FLOOR_ADVERTISING.facadeHeightRatio,
    frontZ: WING_FACE.frontRadius * footprint + 0.0175 + FLOOR_ADVERTISING.surfaceOffset,
    sideX: WING_FACE.sideX * footprint + 0.0175 + FLOOR_ADVERTISING.surfaceOffset,
    sideZ: (sideStart + sideEnd) / 2 * footprint,
    innerEnd: sideStart * footprint,
    outerEnd: sideEnd * footprint,
  };
}

/** Width, not rank, controls the bounded content reduction on tapered faces. */
export function floorContentScale(face: FloorFace, usableWidth: number): number {
  const referenceWidth = face === "front"
    ? WING_FACE.frontWidth * (1 - 2 * FLOOR_ADVERTISING.horizontalInsetRatio)
    : WING_FACE.sideWidth * (1 - FLOOR_ADVERTISING.centerSeamInsetRatio - FLOOR_ADVERTISING.horizontalInsetRatio);
  return Math.max(0.8, Math.min(1, usableWidth / referenceWidth));
}

/** Canvas height rises as a wing tapers; counter that pixel-density change
 * before applying the bounded content reduction. */
export function wingTypeHeight(face: FloorFace, footprint: number): number {
  const bay = floorFacadeDimensions(face, footprint);
  const wideBay = floorFacadeDimensions(face, 1);
  return floorSignCanvasHeight("wing", footprint, face) * (bay.width / wideBay.width) * floorContentScale(face, bay.width);
}

export function floorFaceListingId(listing: Pick<FloorMediaContent, "id">, face: FloorFacadeRole): string {
  void face;
  return listing.id;
}

function textureWidth(role: FloorMediaRole): number {
  return role === "wing" ? FLOOR_ADVERTISING.wingTextureWidth : role === "logo" ? FLOOR_ADVERTISING.logoTextureWidth : FLOOR_ADVERTISING.noseTextureWidth;
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
    context.font = `${weight} ${size}px ${SIGN_FONT_FAMILY}`;
    if (context.measureText(value).width <= maxWidth) return { text: value, size, truncated: false };
    size = Math.max(minimumSize, size - 2);
  }
  context.font = `${weight} ${minimumSize}px ${SIGN_FONT_FAMILY}`;
  if (context.measureText(value).width <= maxWidth) return { text: value, size: minimumSize, truncated: false };
  let fitted = value;
  while (fitted.length > 1 && context.measureText(`${fitted}…`).width > maxWidth) fitted = fitted.slice(0, -1);
  return { text: `${fitted}…`, size: minimumSize, truncated: true };
}

/** Use two balanced lines only when a normal one-line name would become tiny. */
export function fitPrimaryName(context: Pick<CanvasRenderingContext2D, "font" | "measureText">, value: string, maxWidth: number, preferredSize = 112, minimumSize = 62) {
  const single = fitText(context, value, maxWidth, preferredSize, minimumSize);
  if (single.size >= preferredSize * 0.82 && !single.truncated) return { lines: [single], multiline: false };
  const words = value.trim().split(/\s+/);
  if (words.length < 2) return { lines: [single], multiline: false };
  let best: { lines: ReturnType<typeof fitText>[]; score: number } | null = null;
  for (let split = 1; split < words.length; split++) {
    const first = fitText(context, words.slice(0, split).join(" "), maxWidth, preferredSize, minimumSize);
    const second = fitText(context, words.slice(split).join(" "), maxWidth, preferredSize, minimumSize);
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
    const source = logoArtworkCrop(logo);
    const width = source.width, height = source.height;
    const scale = Math.min((size - padding * 2) / width, (size - padding * 2) / height);
    context.drawImage(logo, source.x, source.y, width, height, (size - width * scale) / 2, (size - height * scale) / 2, width * scale, height * scale);
  } else {
    context.textAlign = "center"; context.textBaseline = "middle";
    context.fillStyle = tokens.color.brand.navy; context.font = `800 112px ${SIGN_FONT_FAMILY}`;
    context.fillText(initialsForName(content.name), size / 2, size / 2, size - padding * 2);
  }
}

/** Normalize only transparent or near-white asset margins at display time.
 * Opaque dark logo backgrounds remain part of the supplied artwork. */
export function logoArtworkCrop(logo: HTMLImageElement): { x: number; y: number; width: number; height: number } {
  const sourceWidth = logo.naturalWidth || 1, sourceHeight = logo.naturalHeight || 1;
  const full = { x: 0, y: 0, width: sourceWidth, height: sourceHeight };
  try {
    const sample = document.createElement("canvas");
    const ratio = Math.min(1, 256 / Math.max(sourceWidth, sourceHeight));
    sample.width = Math.max(1, Math.round(sourceWidth * ratio));
    sample.height = Math.max(1, Math.round(sourceHeight * ratio));
    const context = sample.getContext("2d", { willReadFrequently: true });
    if (!context) return full;
    context.drawImage(logo, 0, 0, sample.width, sample.height);
    const pixels = context.getImageData(0, 0, sample.width, sample.height).data;
    const corner = (x: number, y: number) => {
      const i = (y * sample.width + x) * 4;
      return pixels[i + 3] > 240 && pixels[i] > 240 && pixels[i + 1] > 240 && pixels[i + 2] > 240;
    };
    const whiteMatte = corner(0, 0) && corner(sample.width - 1, 0) && corner(0, sample.height - 1) && corner(sample.width - 1, sample.height - 1);
    let minX = sample.width, minY = sample.height, maxX = -1, maxY = -1;
    for (let y = 0; y < sample.height; y++) for (let x = 0; x < sample.width; x++) {
      const i = (y * sample.width + x) * 4;
      const visible = pixels[i + 3] > 24 && (!whiteMatte || pixels[i] < 235 || pixels[i + 1] < 235 || pixels[i + 2] < 235);
      if (visible) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
    }
    if (maxX < minX || maxY < minY) return full;
    const paddingX = Math.max(1, Math.round((maxX - minX + 1) * 0.05));
    const paddingY = Math.max(1, Math.round((maxY - minY + 1) * 0.05));
    minX = Math.max(0, minX - paddingX); minY = Math.max(0, minY - paddingY);
    maxX = Math.min(sample.width - 1, maxX + paddingX); maxY = Math.min(sample.height - 1, maxY + paddingY);
    return { x: minX / sample.width * sourceWidth, y: minY / sample.height * sourceHeight, width: (maxX - minX + 1) / sample.width * sourceWidth, height: (maxY - minY + 1) / sample.height * sourceHeight };
  } catch { return full; }
}

export function drawFloorMedia(context: CanvasRenderingContext2D, content: FloorMediaContent, role: FloorMediaRole, footprint = 1, face: FloorFace = "front", logo?: HTMLImageElement) {
  const width = textureWidth(role), height = floorSignCanvasHeight(role, footprint, face), center = height / 2;
  const scale = floorContentScale(face, floorFacadeDimensions(face, footprint).width);
  context.clearRect(0, 0, width, height);
  if (role === "logo") { drawLogo(context, content, logo); return; }
  // The measured dark glazing is the sole media surface. Canvas carries only
  // content and one restrained architectural accent, never another card.
  context.fillStyle = content.rank === 1 ? tokens.color.brand.summitGold : "#368ef2";
  context.fillRect(width * 0.04, height - Math.max(2, height * 0.005), width * 0.92, Math.max(2, height * 0.005));
  context.textBaseline = "middle";
  const gold = content.rank === 1;
  if (role === "nose") {
    // The nose is a logo-only brand anchor. A badge here sat behind the
    // physical logo plaque at oblique angles; wing advertising owns hiring.
    return;
  }
  const typeHeight = wingTypeHeight(face, footprint);
  // Both V-wing textures are generated independently. The left wing reverses
  // column placement, never glyphs/UVs, so text reads normally on either side.
  const spacingScale = 0.88 + 0.12 * scale;
  const pad = width * 0.045 * spacingScale;
  const logoWidth = height * FLOOR_ADVERTISING.logoSizeRatio * Math.max(0.82, scale);
  const gap = width * 0.034 * spacingScale;
  const statsWidth = width * 0.19;
  const contentX = face === "left" ? pad + statsWidth + gap : pad + logoWidth + gap;
  const contentRight = face === "left" ? width - pad - logoWidth - gap : width - pad - statsWidth - gap;
  const contentWidth = Math.max(1, contentRight - contentX);
  const name = fitPrimaryName(context, content.name, contentWidth, typeHeight * 0.31, typeHeight * 0.19);
  context.fillStyle = tokens.color.brand.white;
  context.textAlign = "left";
  for (const [index, line] of name.lines.entries()) {
    context.font = `800 ${line.size}px ${SIGN_FONT_FAMILY}`;
    const nameY = name.multiline ? center + height * (index === 0 ? -0.25 : -0.025) : center - height * (content.hiring ? 0.15 : 0.12);
    context.fillText(line.text, contentX, nameY);
  }
  if (content.description) {
    const detail = fitText(context, content.description, contentWidth, typeHeight * 0.11, typeHeight * 0.08, 500);
    context.fillStyle = "#b9d6f4";
    context.font = `500 ${detail.size}px ${SIGN_FONT_FAMILY}`;
    context.fillText(detail.text, contentX, center + height * (name.multiline ? 0.17 : content.hiring ? 0.095 : 0.15));
  }
  const statsRight = face === "left" ? pad + statsWidth : width - pad;
  context.fillStyle = gold ? tokens.color.brand.summitGold : tokens.color.brand.white;
  context.textAlign = "right";
  context.font = `800 ${typeHeight * 0.20}px ${SIGN_FONT_FAMILY}`;
  context.fillText(`#${content.rank}`, statsRight, center - height * 0.14);
  const amount = fitText(context, formatMinorUnits(content.totalPaidMinor), statsWidth, typeHeight * 0.18, typeHeight * 0.15);
  context.font = `800 ${amount.size}px ${SIGN_FONT_FAMILY}`;
  context.fillText(amount.text, statsRight, center + height * 0.14);
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
    if (document.fonts) void Promise.all([document.fonts.load("800 96px Montserrat"), document.fonts.load("500 48px Montserrat")]).then(() => { drawFloorMedia(context, content, role, footprint, face, loadedLogo); texture.needsUpdate = true; }).catch(() => { /* Fallback text remains usable if a font request fails. */ });
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
