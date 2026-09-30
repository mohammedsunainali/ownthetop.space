import { describe, expect, it } from "vitest";
import { tokens } from "@/design/tokens";
import { ownTheTopTokens } from "../../design-system/v1/tokens/ownthetop_tokens";

describe("canonical runtime token bridge", () => {
  it("re-exports the canonical design system object", () => {
    expect(tokens).toBe(ownTheTopTokens);
    expect(tokens.environment.sunset.water).toBeDefined();
  });
});
