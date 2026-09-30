"use client";

import { useMemo, useState } from "react";
import { formatMinorUnits } from "@/domain/money";
import type { TowerId } from "@/domain/tower";
import { listingsByTower } from "@/mock";
import { towers } from "@/mock/towers";
import { useWorldStore } from "@/state/world-store";

const STEP_MINOR = 2500;

export function ClaimPanel() {
  const [amountMinor, setAmountMinor] = useState(10000);
  const [towerId, setTowerId] = useState<TowerId>("companies");
  const selectTower = useWorldStore((state) => state.selectTower);

  const estimatedPosition = useMemo(() => {
    const above = listingsByTower[towerId].filter((listing) => listing.totalPaidMinor > amountMinor).length;
    return Math.min(above + 1, listingsByTower[towerId].length + 1);
  }, [amountMinor, towerId]);

  const currentTop = listingsByTower[towerId].find((listing) => listing.rank === 1);

  return (
    <section className="claim-panel" aria-labelledby="claim-heading">
      <div className="claim-panel__intro">
        <span className="eyebrow">Mock claim console</span>
        <h2 id="claim-heading">Place your name in the skyline.</h2>
      </div>

      <div className="amount-control">
        <button type="button" aria-label="Decrease mock amount" onClick={() => setAmountMinor((value) => Math.max(STEP_MINOR, value - STEP_MINOR))}>−</button>
        <div><span>Ranking power</span><strong>{formatMinorUnits(amountMinor)}</strong></div>
        <button type="button" aria-label="Increase mock amount" onClick={() => setAmountMinor((value) => value + STEP_MINOR)}>+</button>
      </div>

      <label className="field-label">
        Your website
        <input type="url" placeholder="https://your-space.example" aria-label="Website URL placeholder" />
      </label>

      <label className="field-label">
        Choose a tower
        <select
          value={towerId}
          onChange={(event) => {
            const nextTower = event.target.value as TowerId;
            setTowerId(nextTower);
            selectTower(nextTower);
          }}
        >
          {towers.map((tower) => <option key={tower.id} value={tower.id}>{tower.name}</option>)}
        </select>
      </label>

      <div className="claim-stats">
        <span>Current top <strong>{currentTop?.name}</strong></span>
        <span>Required amount <strong>{formatMinorUnits((currentTop?.totalPaidMinor ?? 0) + 1)}</strong></span>
        <span>Estimated position <strong>#{estimatedPosition}</strong></span>
      </div>

      <button className="primary-button" type="button" onClick={() => selectTower(towerId)}>Claim the top</button>
      <p className="phase-note">Preview only. Position is an estimate, not a guarantee. Payments arrive later.</p>
    </section>
  );
}
