import type { Listing } from "@/domain/listing";
import type { TowerId } from "@/domain/tower";
import { companies } from "@/mock/companies";
import { people } from "@/mock/people";
import { products } from "@/mock/products";
import { phase3Listings } from "@/mock/phase-3-fixture";

export { companies, people, products };

export const regressionListingsByTower: Record<TowerId, readonly Listing[]> = {
  companies,
  products,
  people,
};
export const listingsByTower: Record<TowerId, readonly Listing[]> = phase3Listings;
export const regressionListings: readonly Listing[] = [...companies, ...products, ...people];
export const allListings: readonly Listing[] = Object.values(listingsByTower).flat();
