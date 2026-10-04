import { describe, expect, it, vi } from "vitest";
import { companies } from "@/mock/companies";
import { listingForInstance } from "@/world/tower/Floor";
import { createFloorSignTexture, fitText, fitWideNameLines, floorSignCacheSize, FACADE_METRICS, isSafeLogoUrl, MAX_CACHED_SIGNS, MAX_FOCUSED_SIGNS, visibleFloorSigns } from "@/world/tower/floor-signs";

describe("instanced ranked floor picking", () => {
  it("maps every wing instance back to one listing", () => {
    for (let index = 0; index < companies.length; index++) {
      for (let wing = 0; wing < 3; wing++) expect(listingForInstance(companies, index * 3 + wing)?.id).toBe(companies[index].id);
    }
    expect(listingForInstance(companies, companies.length * 3)).toBeUndefined();
  });
  it("reuses facade media for unchanged listing display state", () => {
    const canvas = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as never);
    const first = createFloorSignTexture(companies[0]);
    expect(createFloorSignTexture(companies[0])).toBe(first);
    expect(floorSignCacheSize()).toBeGreaterThan(0);
    canvas.mockRestore();
  });
  it("bounds detailed facade media and rejects arbitrary remote logo loading", () => {
    expect(visibleFloorSigns(companies, null, true, 25)).toHaveLength(MAX_FOCUSED_SIGNS);
    expect(MAX_CACHED_SIGNS).toBe(24);
    expect(isSafeLogoUrl("/brand/example.svg")).toBe(true);
    expect(isSafeLogoUrl("data:image/png;base64,AA==")).toBe(true);
    expect(isSafeLogoUrl("data:image/svg+xml,test")).toBe(false);
    expect(isSafeLogoUrl("https://untrusted.example/logo.png")).toBe(false);
  });
  it("uses separate physical aspect ratios and keeps both layouts inside columns", () => {
    expect(FACADE_METRICS.wide.width / FACADE_METRICS.wide.height).toBe(4);
    expect(FACADE_METRICS.compact.width / FACADE_METRICS.compact.height).toBe(2.5);
    for (const metrics of Object.values(FACADE_METRICS)) {
      expect(metrics.logoX + metrics.logoWidth).toBeLessThan(metrics.textX);
      expect(metrics.textX + metrics.textWidth).toBeLessThan(metrics.rankX);
      expect(metrics.rankX + metrics.rankWidth).toBeLessThan(metrics.width);
    }
    const canvas = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as never);
    const wide = createFloorSignTexture(companies[25], "wide", 0.72);
    const compact = createFloorSignTexture(companies[25], "compact", 0.72);
    expect(wide.image.width / wide.image.height).toBeCloseTo(4 * 0.72, 1);
    expect(compact.image.width / compact.image.height).toBeCloseTo(2.5 * 0.72, 1);
    canvas.mockRestore();
  });
  it("shrinks a realistic long name before truncating at the minimum", () => {
    const context = { font: "", measureText: vi.fn(function(this: { font: string }, value: string) {
      const size = Number(this.font.match(/(\d+)px/)?.[1] ?? 0);
      return { width: value.length * size * 0.55 } as TextMetrics;
    }) };
    const fitted = fitText(context, "Skyline Ventures International", 950, 78, 54);
    expect(fitted.truncated).toBe(false);
    expect(fitted.size).toBeLessThan(78);
    expect(fitWideNameLines(context, "Karooli, technology for what makes us human", 790).lines).toHaveLength(2);
    const tooLong = fitText(context, "Karooli, technology for what makes us human", 500, 78, 54);
    expect(tooLong.size).toBe(54);
    expect(tooLong.truncated).toBe(true);
    expect(tooLong.text.endsWith("…")).toBe(true);
  });
  it("keeps the dual-layout cache bounded under 50 listings", () => {
    const canvas = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as never);
    for (const listing of companies) for (const layout of ["wide", "compact"] as const) createFloorSignTexture(listing, layout);
    expect(floorSignCacheSize()).toBeLessThanOrEqual(MAX_CACHED_SIGNS);
    canvas.mockRestore();
  });
});
