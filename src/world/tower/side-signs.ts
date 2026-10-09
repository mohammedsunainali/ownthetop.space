import { CanvasTexture, SRGBColorSpace } from "three";
import { tokens } from "@/design/tokens";
import { formatMinorUnits } from "@/domain/money";
import { fitPrimaryName, fitText, initialsForName, isSafeLogoUrl, SIGN_FONT_FAMILY, type FloorMediaContent } from "./floor-signs";
import { recordNavigationSample } from "@/world/navigation-performance";

export type SideMediaRole = "identity" | "ranking";
export const SIDE_AD = { width: 1280, height: 384, worldWidth: 4, worldHeight: 1.2, faceX: 3.49, margin: 32, logo: { x: 36, y: 92, size: 200 }, identityX: 272 } as const;
export const SIDE_FACES = [
  { role: "identity", x: -SIDE_AD.faceX, angle: -Math.PI / 2 },
  { role: "ranking", x: SIDE_AD.faceX, angle: Math.PI / 2 },
] as const;

/** Numeric values shrink, but never lose digits or acquire ellipses. */
function numericFit(context: Pick<CanvasRenderingContext2D, "font" | "measureText">, value: string, width: number) {
  context.font = `800 88px ${SIGN_FONT_FAMILY}`;
  return { text: value, size: Math.min(88, 88 * width / Math.max(1, context.measureText(value).width)) };
}
export function sideTextLayout(context: Pick<CanvasRenderingContext2D, "font" | "measureText">, content: FloorMediaContent, role: SideMediaRole) {
  const width = SIDE_AD.width - SIDE_AD.margin - SIDE_AD.identityX;
  return {
    name: role === "identity" ? fitPrimaryName(context, content.name, width, 68, 52) : null,
    tagline: role === "identity" ? fitText(context, content.description, content.hiring ? 535 : width, 34, 28, 500) : null,
    rank: numericFit(context, `#${content.rank}`, width),
    amount: numericFit(context, formatMinorUnits(content.totalPaidMinor), width),
  };
}

/** Owned media, not an unbounded global cache. The near-floor LOD bounds 1280px allocation. */
export function createSideTexture(content: FloorMediaContent, role: SideMediaRole, detailed: boolean): CanvasTexture {
  const started = performance.now();
  const canvas = document.createElement("canvas");
  canvas.width = detailed ? SIDE_AD.width : 320; canvas.height = detailed ? SIDE_AD.height : 96;
  const context = canvas.getContext("2d");
  let image: HTMLImageElement | undefined;
  const paint = () => {
    const paintStarted = performance.now();
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save(); context.scale(canvas.width / SIDE_AD.width, canvas.height / SIDE_AD.height);
    // A continuous architectural band, with glazing retained around its edges.
    // Window mullions behind the plane must not compete with small side text.
    context.fillStyle = tokens.color.brand.navy; context.globalAlpha = 0.9;
    context.fillRect(0, 0, SIDE_AD.width, SIDE_AD.height); context.globalAlpha = 1;
    const logo = SIDE_AD.logo, layout = sideTextLayout(context, content, role);
    context.fillStyle = tokens.color.brand.softWhite;
    context.beginPath(); context.roundRect(logo.x, logo.y, logo.size, logo.size, 28); context.fill();
    if (image) {
      const fit = Math.min((logo.size - 30) / image.naturalWidth, (logo.size - 30) / image.naturalHeight);
      const width = image.naturalWidth * fit, height = image.naturalHeight * fit;
      context.drawImage(image, logo.x + (logo.size - width) / 2, logo.y + (logo.size - height) / 2, width, height);
    } else {
      context.fillStyle = tokens.color.brand.navy; context.textAlign = "center"; context.textBaseline = "middle";
      context.font = `800 68px ${SIGN_FONT_FAMILY}`; context.fillText(initialsForName(content.name), logo.x + logo.size / 2, logo.y + logo.size / 2, logo.size - 24);
    }
    context.textAlign = "left"; context.textBaseline = "middle"; context.fillStyle = tokens.color.brand.white;
    if (role === "identity" && layout.name && layout.tagline) {
      layout.name.lines.forEach((line, index) => {
        context.font = `800 ${line.size}px ${SIGN_FONT_FAMILY}`;
        context.fillText(line.text, SIDE_AD.identityX, layout.name!.multiline ? 96 + index * 72 : 125);
      });
      context.fillStyle = tokens.color.brand.softWhite;
      context.font = `500 ${layout.tagline.size}px ${SIGN_FONT_FAMILY}`;
      context.fillText(layout.tagline.text, SIDE_AD.identityX, layout.name.multiline ? 265 : 235);
    } else {
      context.fillStyle = content.rank === 1 ? tokens.color.brand.summitGold : tokens.color.brand.white;
      context.font = `800 ${layout.rank.size}px ${SIGN_FONT_FAMILY}`; context.fillText(layout.rank.text, SIDE_AD.identityX, 120);
      context.font = `800 ${layout.amount.size}px ${SIGN_FONT_FAMILY}`; context.fillText(layout.amount.text, SIDE_AD.identityX, 265);
    }
    context.restore();
    recordNavigationSample("sideTexturePaintMs", performance.now()-paintStarted);
  };
  paint();
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = detailed ? 4 : 1;
  texture.userData.active = true; texture.addEventListener("dispose", () => { texture.userData.active = false; });
  if (document.fonts) void Promise.all([document.fonts.load("800 68px Montserrat"), document.fonts.load("500 34px Montserrat")]).then(() => { if (texture.userData.active) { paint(); texture.needsUpdate = true; } }).catch(() => {});
  if (content.logoUrl && isSafeLogoUrl(content.logoUrl)) {
    const asset = new Image(); asset.onload = () => { if (texture.userData.active && asset.naturalWidth && asset.naturalHeight) { image = asset; paint(); texture.needsUpdate = true; } }; asset.src = content.logoUrl;
  }
  recordNavigationSample("sideTextureCreateMs",performance.now()-started);
  return texture;
}
