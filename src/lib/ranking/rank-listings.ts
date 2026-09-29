import type { RankableListing, RankedListing } from "@/domain/ranking";

export function rankListings<T extends RankableListing>(listings: readonly T[]): RankedListing<T>[] {
  const towerGroups = new Map<string, Array<{ listing: T; inputIndex: number }>>();

  listings.forEach((listing, inputIndex) => {
    const group = towerGroups.get(listing.towerId) ?? [];
    group.push({ listing, inputIndex });
    towerGroups.set(listing.towerId, group);
  });

  const rankedByInputIndex = new Map<number, RankedListing<T>>();

  towerGroups.forEach((group) => {
    group
      .slice()
      .sort((a, b) => {
        const paymentDifference = b.listing.totalPaidMinor - a.listing.totalPaidMinor;
        if (paymentDifference !== 0) return paymentDifference;

        const claimedDifference = Date.parse(a.listing.claimedAt) - Date.parse(b.listing.claimedAt);
        if (claimedDifference !== 0) return claimedDifference;

        return a.inputIndex - b.inputIndex;
      })
      .forEach(({ listing, inputIndex }, rankIndex) => {
        rankedByInputIndex.set(inputIndex, { ...listing, rank: rankIndex + 1 });
      });
  });

  return listings.map((_, index) => rankedByInputIndex.get(index)!);
}
