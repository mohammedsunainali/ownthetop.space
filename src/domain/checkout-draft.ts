import type { TowerId } from "./tower";

export interface CheckoutDraft {
  name: string;
  subtitle: string;
  url: string;
  towerId: TowerId;
  category: string;
  hiring: boolean;
  logoUrl: string | null;
  amountMinor: number;
  currency: "USD";
  estimatedRank: number;
}

export function validateFloorContent(name: string, subtitle: string): string | null {
  if (name.trim().length < 2 || name.trim().length > 60) return "Display name must be 2–60 characters.";
  if (subtitle.trim().length < 3 || subtitle.trim().length > 100) return "Subtitle must be 3–100 characters.";
  return null;
}

/** Local UI validation only. A future server must independently validate every field. */
export function validateCheckoutDraft(value: unknown): value is CheckoutDraft {
  if (!value || typeof value !== "object") return false;
  const d = value as CheckoutDraft;
  if (typeof d.name !== "string" || typeof d.subtitle !== "string" || validateFloorContent(d.name, d.subtitle)) return false;
  if (!["companies", "products", "people"].includes(d.towerId) || !["technology", "creative", "commerce", "other"].includes(d.category)) return false;
  if (d.currency !== "USD" || !Number.isSafeInteger(d.amountMinor) || d.amountMinor <= 0 || !Number.isSafeInteger(d.estimatedRank) || d.estimatedRank < 1 || typeof d.hiring !== "boolean") return false;
  if (typeof d.url !== "string" || d.url.length > 2048 || /\s/.test(d.url)) return false;
  try {
    const u = new URL(/^https?:\/\//i.test(d.url) ? d.url : `https://${d.url}`);
    if (!["https:", "http:"].includes(u.protocol) || !u.hostname.includes(".") || u.username || u.password) return false;
  } catch { return false; }
  return d.logoUrl === null || typeof d.logoUrl === "string" && d.logoUrl.length <= 4 * 1024 * 1024 + 100 && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(d.logoUrl);
}
