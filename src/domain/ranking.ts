import type { Listing, UnrankedListing } from "@/domain/listing";

export type RankableListing = Listing | UnrankedListing;
export type RankedListing<T extends RankableListing = RankableListing> = T & {
  rank: number;
};
