import { describe, expect, it, vi } from "vitest";
import { companies } from "@/mock/companies";
import { listingForInstance, paidFloorColor } from "@/world/tower/Floor";
import { createFloorSignTexture, drawFloorMedia, fitPrimaryName, fitText, floorFaceListingId, floorFacadeDimensions, floorSignCacheSize, FLOOR_ADVERTISING, FLOOR_FACADE_ROLES, initialsForName, isSafeLogoUrl, MAX_CACHED_SIGNS, MAX_FOCUSED_SIGNS, visibleFloorSigns } from "@/world/tower/floor-signs";
import { tokens } from "@/design/tokens";

describe("V2 logical floor advertising", () => {
  it("maps every structural wing and coordinated media face to the same listing", () => {
    for (let index = 0; index < companies.length; index++) {
      for (let wing = 0; wing < 3; wing++) expect(listingForInstance(companies, index * 3 + wing)?.id).toBe(companies[index].id);
      for (const face of FLOOR_FACADE_ROLES) expect(floorFaceListingId(companies[index], face)).toBe(companies[index].id);
    }
    expect(listingForInstance(companies, companies.length * 3)).toBeUndefined();
    expect(FLOOR_FACADE_ROLES.filter((face) => face.role === "primary")).toHaveLength(1);
    expect(new Set(FLOOR_FACADE_ROLES.map((face) => face.role))).toEqual(new Set(["primary", "brand", "status"]));
  });

  it("keeps the native blue architecture for #1 and all selected floors", () => {
    expect(paidFloorColor(1, "blue")).toBe(tokens.color.brand.lightBlue);
    expect(paidFloorColor(32, "blue")).toBe(tokens.color.brand.lightBlue);
    expect(paidFloorColor(20, "lavender")).toBe(tokens.color.brand.lavender);
    expect(paidFloorColor(20, "teal")).toBe(tokens.color.brand.teal);
  });

  it("derives facade dimensions from the tapered footprint and stops before the core", () => {
    const large = floorFacadeDimensions("left", 1);
    const small = floorFacadeDimensions("left", 0.72);
    expect(small.width / large.width).toBeCloseTo(0.72);
    expect(large.width / (1.13 * 1)).toBeCloseTo(1 - 2 * FLOOR_ADVERTISING.horizontalInsetRatio);
    expect(large.innerEnd).toBeGreaterThan(1.1);
    expect(large.outerEnd).toBeLessThan(2.305);
    expect(large.height).toBeCloseTo(0.62 * 0.84 * 0.72);
    expect(floorFacadeDimensions("front", 1).width).toBeGreaterThan(large.width);
  });

  it("uses orientation-correct textures and a physical-logo texture", () => {
    const canvas = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as never);
    const primary = createFloorSignTexture(companies[25], "primary", 0.72, "front");
    const sideBrand = createFloorSignTexture(companies[25], "brand", 0.72, "left");
    const logo = createFloorSignTexture(companies[25], "logo", 0.72);
    expect(primary.image.width / primary.image.height).toBeCloseTo(floorFacadeDimensions("front", 0.72).width / floorFacadeDimensions("front", 0.72).height, 1);
    expect(sideBrand.image.width / sideBrand.image.height).toBeCloseTo(floorFacadeDimensions("left", 0.72).width / floorFacadeDimensions("left", 0.72).height, 1);
    expect(logo.image.width).toBe(logo.image.height);
    expect(createFloorSignTexture(companies[25], "primary", 0.72, "front")).toBe(primary);
    canvas.mockRestore();
  });

  it("shrinks names before ellipsis without moving another column", () => {
    const context = { font: "", measureText: vi.fn(function(this: { font: string }, value: string) {
      const size = Number(this.font.match(/(\d+)px/)?.[1] ?? 0);
      return { width: value.length * size * 0.55 } as TextMetrics;
    }) };
    const fitted = fitText(context, "Skyline Ventures International", 950, 78, 42);
    expect(fitted.truncated).toBe(false);
    expect(fitted.size).toBeLessThan(78);
    const tooLong = fitText(context, "Karooli, technology for what makes us human", 500, 78, 42);
    expect(tooLong.size).toBe(42);
    expect(tooLong.truncated).toBe(true);
    expect(tooLong.text.endsWith("…")).toBe(true);
    const balanced = fitPrimaryName(context, "Northstar Foundry", 600);
    expect(balanced.multiline).toBe(true);
    expect(balanced.lines.map((line) => line.text).join(" ")).toBe("Northstar Foundry");
  });

  it("uses stable initials fallback and only draws hiring when true", () => {
    expect(initialsForName("Juniper Learning")).toBe("JL");
    expect(initialsForName("Copper Cloud")).toBe("CC");
    const text = vi.fn();
    const context = {
      font: "", fillStyle: "", textAlign: "left", textBaseline: "middle",
      measureText(value: string) { return { width: value.length * 8 } as TextMetrics; },
      clearRect: vi.fn(), fillText: text, beginPath: vi.fn(), roundRect: vi.fn(), fill: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
    const nonHiring = { ...companies[0], hiring: false };
    drawFloorMedia(context, nonHiring, "primary", 1, "front");
    expect(text.mock.calls.flat().join(" ")).not.toContain("HIRING");
    text.mockClear();
    drawFloorMedia(context, { ...companies[0], hiring: true }, "primary", 1, "front");
    expect(text.mock.calls.flat().join(" ")).toContain("HIRING");
  });

  it("bounds detailed signs and the five-layout texture cache", () => {
    expect(visibleFloorSigns(companies, null, true, 25)).toHaveLength(MAX_FOCUSED_SIGNS);
    expect(visibleFloorSigns(companies, null, false)).toHaveLength(1);
    const canvas = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as never);
    for (const listing of companies) for (const [role, face] of [["primary", "front"], ["brand", "front"], ["brand", "left"], ["status", "right"], ["logo", "front"]] as const) createFloorSignTexture(listing, role, 1, face);
    expect(floorSignCacheSize()).toBeLessThanOrEqual(MAX_CACHED_SIGNS);
    canvas.mockRestore();
    expect(isSafeLogoUrl("/brand/example.svg")).toBe(true);
    expect(isSafeLogoUrl("data:image/png;base64,AA==")).toBe(true);
    expect(isSafeLogoUrl("data:image/svg+xml,test")).toBe(false);
    expect(isSafeLogoUrl("https://untrusted.example/logo.png")).toBe(false);
  });
});
