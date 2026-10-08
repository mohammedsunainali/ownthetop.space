import { companies } from "@/mock/companies";
import { products } from "@/mock/products";
import { people } from "@/mock/people";

/** Isolated architectural design inventory. Full source datasets remain intact. */
export const phase3Listings = {companies:companies.slice(0,24),products:products.slice(0,14),people:people.slice(0,14)};
