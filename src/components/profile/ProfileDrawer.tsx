"use client";

import Image from "next/image";
import { formatMinorUnits } from "@/domain/money";
import { allListings } from "@/mock";
import { useWorldStore } from "@/state/world-store";
import { initialsForName, isSafeLogoUrl } from "@/world/tower/floor-signs";

export function ProfileDrawer() {
  const selectedListingId = useWorldStore((state) => state.selectedListingId);
  const selected = allListings.find((listing) => listing.id === selectedListingId);

  if (!selected) {
    return (
      <aside className="profile-drawer profile-drawer--empty" aria-live="polite">
        <Image src="/brand/ownthetop-mascot-flat.svg" alt="" width={54} height={54} />
        <span className="eyebrow">Floor profile</span>
        <strong>Select a lit floor</strong>
        <p>Each claimed listing occupies exactly one floor.</p>
      </aside>
    );
  }

  const listedDate = Number.isNaN(Date.parse(selected.claimedAt)) ? null : new Date(selected.claimedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const safeLogo = selected.logoUrl && isSafeLogoUrl(selected.logoUrl) ? selected.logoUrl : null;
  const amount = formatMinorUnits(selected.totalPaidMinor, selected.currency);

  return (
    <aside className={`profile-drawer profile-drawer--detail${selected.hiring ? " profile-drawer--hiring" : ""}`} aria-live="polite" aria-label={`${selected.name} floor profile`}>
      {selected.hiring ? <div className="profile-hiring">HIRING ACTIVELY</div> : null}
      <div className="profile-drawer__body">
      <div className="profile-drawer__topline">
        <div className="profile-mark" aria-hidden="true">{safeLogo ? <Image src={safeLogo} alt="" width={72} height={72} unoptimized /> : initialsForName(selected.name)}</div>
        <span className="profile-rank">Rank #{selected.rank}</span>
        <button className="profile-close" type="button" aria-label="Close profile" onClick={() => useWorldStore.getState().selectTower(selected.towerId)}>×</button>
      </div>
      <h2>{selected.name}</h2>
      <p className="profile-price">{selected.hiring ? `Claimed floor at ${amount}` : `${amount} cumulative`}</p>
      <div className="profile-tags">
        <span>{selected.category}</span>
        {selected.location ? <span>{selected.location}</span> : null}
      </div>
      {selected.description ? <p className="profile-description">{selected.description}</p> : null}
      <a className="profile-url" href={selected.url} target="_blank" rel="noopener noreferrer">Visit website ↗</a>
      <dl className="profile-details">
        <div><dt>Category</dt><dd>{selected.category}</dd></div>
        {selected.location ? <div><dt>Location</dt><dd>{selected.location}</dd></div> : null}
        {listedDate ? <div><dt>Listed</dt><dd>{listedDate}</dd></div> : null}
        {selected.description ? <div><dt>About</dt><dd>{selected.description}</dd></div> : null}
      </dl>
      </div>
    </aside>
  );
}
