import type { Currency } from "@/domain/listing";

export function assertMinorUnits(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError("Money must be a non-negative safe integer in minor units.");
  }
}

export function formatMinorUnits(value: number, currency: Currency = "USD"): string {
  assertMinorUnits(value);
  const hasFractionalMajorUnit = value % 100 !== 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: hasFractionalMajorUnit ? 2 : 0,
    maximumFractionDigits: hasFractionalMajorUnit ? 2 : 0,
  }).format(value / 100);
}
