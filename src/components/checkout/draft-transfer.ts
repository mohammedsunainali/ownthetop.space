import { validateCheckoutDraft, type CheckoutDraft } from "@/domain/checkout-draft";

export const CHECKOUT_DRAFT_KEY = "ownthetop.checkout-draft.v1";
export const DRAFT_LIFETIME_MS = 30 * 60 * 1000;
const eventName = "ownthetop-checkout-draft";
let cachedRaw: string | null = null;
let cachedDraft: CheckoutDraft | null = null;

/** Same-origin, tab-scoped, temporary storage; nothing is sent to a payment provider. */
export function saveCheckoutDraft(draft: CheckoutDraft): string | null {
  if (!validateCheckoutDraft(draft)) return "Check your floor details before continuing.";
  try {
    window.sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify({ version: 1, expiresAt: Date.now() + DRAFT_LIFETIME_MS, draft }));
    window.dispatchEvent(new Event(eventName));
    return null;
  } catch {
    return "Your browser could not carry this draft to checkout. Enable temporary site storage or try a smaller logo. Your form has been kept.";
  }
}

export function readCheckoutDraft(): CheckoutDraft | null {
  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) { cachedRaw = null; cachedDraft = null; return null; }
    const envelope = JSON.parse(raw);
    if (envelope.version !== 1 || !Number.isFinite(envelope.expiresAt) || envelope.expiresAt <= Date.now() || envelope.expiresAt > Date.now() + DRAFT_LIFETIME_MS || !validateCheckoutDraft(envelope.draft)) {
      window.sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
      cachedRaw = null; cachedDraft = null; return null;
    }
    if (raw !== cachedRaw) { cachedRaw = raw; cachedDraft = envelope.draft; }
    return cachedDraft;
  } catch { cachedRaw = null; cachedDraft = null; return null; }
}

export function subscribeCheckoutDraft(callback: () => void) {
  const interval = window.setInterval(callback, 1000);
  window.addEventListener(eventName, callback);
  window.addEventListener("storage", callback);
  return () => { window.clearInterval(interval); window.removeEventListener(eventName, callback); window.removeEventListener("storage", callback); };
}
