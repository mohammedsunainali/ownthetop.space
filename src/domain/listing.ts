import type { TowerId } from "@/domain/tower";

export type EntityType = "company" | "product" | "person";
export type Currency = "USD";

export interface Listing {
  id: string;
  towerId: TowerId;
  entityType: EntityType;
  normalizedUrl: string;
  url: string;
  name: string;
  description: string;
  logoUrl: string | null;
  category: string;
  location: string | null;
  hiring: boolean;
  totalPaidMinor: number;
  currency: Currency;
  rank: number;
  claimedAt: string;
  updatedAt?: string;
}

export type UnrankedListing = Omit<Listing, "rank">;
