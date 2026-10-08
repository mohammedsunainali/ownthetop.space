import { CanvasTexture, SRGBColorSpace } from "three";
import type { FloorMediaContent } from "@/world/tower/floor-signs";
import { fitPrimaryName, fitText, SIGN_FONT_FAMILY } from "@/world/tower/floor-signs";
import { RECTANGULAR_AD as grid } from "@/world/tower/rectangular-layout";
import { formatMinorUnits } from "@/domain/money";
import { tokens } from "@/design/tokens";

/** React Strict Mode may remount an owned Three texture before async artwork loads. */
export function activateRectangularTexture(texture:CanvasTexture) { texture.userData.active=true;texture.needsUpdate=true; }

export function rectangularTextLayout(context: Pick<CanvasRenderingContext2D, "font" | "measureText">, content: FloorMediaContent) {
  const right = content.hiring ? grid.hiringIdentityRight : grid.identityRight;
  const name = fitPrimaryName(context, content.name, right - grid.identityX, grid.nameSize, grid.nameMinimum);
  const subtitleWidth = (content.hiring ? grid.hiringIdentityRight : grid.identityRight) - grid.identityX;
  const words = content.description.trim().split(/\s+/);
  const lines: string[] = []; let current = "";
  context.font = `500 ${grid.subtitleSize}px ${SIGN_FONT_FAMILY}`;
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && context.measureText(next).width > subtitleWidth) { lines.push(current); current = word; }
    else current = next;
  }
  if (current) lines.push(current);
  const subtitle = lines.slice(0, 2).map((value, i) => fitText(context, i === 1 && lines.length > 2 ? `${value} ${lines.slice(2).join(" ")}` : value, subtitleWidth, grid.subtitleSize, grid.subtitleMinimum, 500));
  // Numeric truth is never ellipsized, including unusually large valid values.
  const amount = fitText(context, formatMinorUnits(content.totalPaidMinor), grid.statsRight - grid.statsLeft, grid.statsSize, 1);
  const rank = fitText(context, `#${content.rank}`, grid.statsRight - grid.statsLeft, grid.statsSize, 1);
  return { name, subtitle, amount, rank, identityRight: right };
}

export function drawRectangularAdvertisement(context: CanvasRenderingContext2D, content: FloorMediaContent) {
  context.clearRect(0, 0, grid.width, grid.height);
  const layout = rectangularTextLayout(context, content);
  context.textAlign = "left"; context.textBaseline = "middle";
  context.fillStyle = tokens.color.brand.white;
  layout.name.lines.forEach((line, index) => {
    context.font = `800 ${line.size}px ${SIGN_FONT_FAMILY}`;
    context.fillText(line.text, grid.identityX, layout.name.multiline ? 88 + index * 84 : 125);
  });
  context.fillStyle = tokens.color.brand.softWhite;
  layout.subtitle.forEach((line, index) => {
    context.font = `500 ${line.size}px ${SIGN_FONT_FAMILY}`;
    context.fillText(line.text, grid.identityX, (layout.name.multiline ? 252 : 230) + index * 49);
  });
  context.textAlign = "right";
  context.fillStyle = content.rank === 1 ? tokens.color.brand.summitGold : tokens.color.brand.white;
  context.font = `800 ${layout.rank.size}px ${SIGN_FONT_FAMILY}`;
  context.fillText(layout.rank.text, grid.statsRight, 117);
  context.font = `800 ${layout.amount.size}px ${SIGN_FONT_FAMILY}`;
  context.fillText(layout.amount.text, grid.statsRight, 258);
}

/** Mounted textures own their resources; detailed floor visibility bounds allocation. */
export function createRectangularTexture(content: FloorMediaContent, logo = false, lowResolution = false): CanvasTexture {
  const canvas = document.createElement("canvas"); canvas.width = logo ? 256 : lowResolution ? 512 : grid.width; canvas.height = logo ? 256 : lowResolution ? 96 : grid.height;
  const context = canvas.getContext("2d");
  let image: HTMLImageElement | undefined;
  const paint = () => { if (context) { if (logo) {
    context.clearRect(0, 0, 256, 256);
    context.fillStyle = tokens.color.brand.softWhite;
    context.beginPath(); context.roundRect(0, 0, 256, 256, 40); context.fill();
    if (image) {
      const scale = Math.min(208 / image.naturalWidth, 208 / image.naturalHeight);
      const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
      context.drawImage(image, (256 - width) / 2, (256 - height) / 2, width, height);
    } else {
      context.fillStyle = tokens.color.brand.navy; context.textAlign = "center"; context.textBaseline = "middle";
      context.font = `800 86px ${SIGN_FONT_FAMILY}`;
      context.fillText(content.name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join(""), 128, 128, 208);
    }
  } else {
    context.save();context.scale(canvas.width/grid.width,canvas.height/grid.height);
    drawRectangularAdvertisement(context, content);
    if(lowResolution){context.fillStyle=tokens.color.brand.softWhite;context.beginPath();context.roundRect(48,64,256,256,36);context.fill();
      if(image){const scale=Math.min(208/image.naturalWidth,208/image.naturalHeight);const w=image.naturalWidth*scale,h=image.naturalHeight*scale;context.drawImage(image,176-w/2,192-h/2,w,h);}
      else{context.fillStyle=tokens.color.brand.navy;context.font=`800 86px ${SIGN_FONT_FAMILY}`;context.textAlign="center";context.fillText(content.name.split(/\s+/).slice(0,2).map(word=>word[0]).join(""),176,192,210);}
    }
    context.restore();
  } } };
  paint();
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4;
  texture.userData.active=true; texture.addEventListener("dispose", () => { texture.userData.active=false; });
  if (document.fonts) void Promise.all([document.fonts.load("800 94px Montserrat"), document.fonts.load("500 46px Montserrat")]).then(() => { if (texture.userData.active) { paint(); texture.needsUpdate = true; } }).catch(() => {});
  if ((logo || lowResolution) && content.logoUrl && (/^\/(?!\/)/.test(content.logoUrl) || /^data:image\/(png|jpeg|webp);base64,/.test(content.logoUrl))) {
    const asset = new Image(); asset.onload = () => { if (texture.userData.active) { image = asset; paint(); texture.needsUpdate = true; } }; asset.src = content.logoUrl;
  }
  return texture;
}
