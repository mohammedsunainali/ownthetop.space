import type { Listing } from "@/domain/listing";
import type { TowerId } from "@/domain/tower";
import { companies } from "@/mock/companies";
import { people } from "@/mock/people";
import { products } from "@/mock/products";

export { companies, people, products };

export const listingsByTower: Record<TowerId, readonly Listing[]> = {
  companies,
  products,
  people,
};

export const allListings: readonly Listing[] = [...companies, ...products, ...people];
