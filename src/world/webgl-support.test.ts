import { afterEach, describe, expect, it, vi } from "vitest";

describe("WebGL capability gate", () => {
  afterEach(() => { window.history.replaceState({}, "", "/"); vi.restoreAllMocks(); vi.resetModules(); });
  it("provides a deterministic route to exercise the 2D fallback", async () => {
    window.history.replaceState({}, "", "/?fallback2d");
    const { canUseWebGL } = await import("@/world/webgl-support");
    expect(canUseWebGL()).toBe(false);
  });
  it("falls back when neither WebGL context can be created", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const { canUseWebGL } = await import("@/world/webgl-support");
    expect(canUseWebGL()).toBe(false);
  });
});
