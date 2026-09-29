"use client";

import { formatMinorUnits } from "@/domain/money";
import { allListings } from "@/mock";
import { useWorldStore } from "@/state/world-store";

export function ProfileDrawer() {
  const selectedListingId = useWorldStore((state) => state.selectedListingId);
  const selected = allListings.find((listing) => listing.id === selectedListingId);

  if (!selected) {
    return (
      <aside className="profile-drawer profile-drawer--empty" aria-live="polite">
        <span className="eyebrow">Floor profile</span>
        <strong>Select a lit floor</strong>
        <p>Each claimed listing occupies exactly one floor.</p>
      </aside>
    );
  }

  return (
    <aside className="profile-drawer" aria-live="polite">
      <div className="profile-drawer__topline">
        <div className="profile-mark" aria-hidden="true">{selected.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
        <span>Rank #{selected.rank}</span>
      </div>
      <h2>{selected.name}</h2>
      <p className="profile-price">{formatMinorUnits(selected.totalPaidMinor, selected.currency)} cumulative</p>
      <div className="profile-tags">
        <span>{selected.category}</span>
        {selected.location ? <span>{selected.location}</span> : null}
        <span>{selected.hiring ? "Hiring" : "Not hiring"}</span>
      </div>
      <p>{selected.description}</p>
      <p className="profile-url">{selected.url}</p>
    </aside>
  );
}
