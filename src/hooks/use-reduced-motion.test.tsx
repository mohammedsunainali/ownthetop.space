import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

describe("reduced motion capability", () => {
  afterEach(() => vi.unstubAllGlobals());
  it.each([true, false])("reflects prefers-reduced-motion=%s", (matches) => {
    vi.stubGlobal("matchMedia", () => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    expect(renderHook(() => useReducedMotion()).result.current).toBe(matches);
  });
});
