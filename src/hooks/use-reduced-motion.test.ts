import { expect, it } from "vitest";
import { reducedMotionFixture } from "./use-reduced-motion";

it("permits deterministic reduced-motion QA only in explicit diagnostics sessions", () => {
  expect(reducedMotionFixture("?diagnostics=1&reducedMotion=1")).toBe(true);
  expect(reducedMotionFixture("?reducedMotion=1")).toBe(false);
  expect(reducedMotionFixture("?diagnostics=1")).toBe(false);
});
