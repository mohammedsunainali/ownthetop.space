import { describe, expect, it } from "vitest";
import { mockReaction, nextMockAmount } from "@/components/shell/mock-reactions";

describe("Phase 2 mock amount reactions", () => {
  it("can reach one-dollar and small-amount demo states", () => {
    expect(nextMockAmount(200, -1)).toBe(100);
    expect(nextMockAmount(100, -1)).toBe(100);
    expect(nextMockAmount(100, 1)).toBe(200);
    expect(mockReaction(100, 100000).sound).toBe("tiny");
    expect(mockReaction(500, 100000).sound).toBe("awkward");
  });
  it("distinguishes near top, takeover, and large overbid without payments", () => {
    expect(mockReaction(95000, 100000).sound).toBe("tension");
    expect(mockReaction(100001, 100000).sound).toBe("win");
    expect(mockReaction(200000, 100000).sound).toBe("huge");
  });
});
