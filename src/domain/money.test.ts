import { describe, expect, it } from "vitest";
import { assertMinorUnits, formatMinorUnits } from "@/domain/money";

describe("money helpers", () => {
  it("formats integer minor units", () => {
    expect(formatMinorUnits(100)).toBe("$1");
    expect(formatMinorUnits(9900)).toBe("$99");
    expect(formatMinorUnits(1050)).toBe("$10.50");
  });

  it("rejects fractional, negative, and unsafe minor units", () => {
    expect(() => assertMinorUnits(10.5)).toThrow(RangeError);
    expect(() => assertMinorUnits(-1)).toThrow(RangeError);
    expect(() => assertMinorUnits(Number.MAX_SAFE_INTEGER + 1)).toThrow(RangeError);
  });
});
