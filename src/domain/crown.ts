/** Separate from ranked floor inventory. No prices, payments or ownership inferred. */
export type CrownStatus =
  | { kind: "demo" }
  | { kind: "available" | "reserved" | "unavailable"; verifiedRecordId: string }
  | { kind: "claimed"; verifiedRecordId: string; sponsorName: string };
export const crownStatus: CrownStatus = { kind: "demo" };
export function crownCopy(status: CrownStatus, previewName = "") {
  if (status.kind === "claimed") return { label: "Verified sponsor", title: status.sponsorName, subtitle: "OwnTheTop · Crown Showroom" };
  if (status.kind === "reserved" || status.kind === "unavailable") return { label: status.kind === "reserved" ? "Reserved" : "Unavailable", title: "Above the leaderboard. Beyond ordinary.", subtitle: "Crown Showroom" };
  return { label: status.kind === "demo" ? "Demo showroom · no purchase" : "Verified availability", title: previewName || "The best view isn't claimed yet.", subtitle: previewName ? "Unpaid visual preview · no reservation" : "Your brand could be next above the skyline." };
}
export function crownPreviewName(value: string) { return value.trim().replace(/\s+/g," ").slice(0,48); }
