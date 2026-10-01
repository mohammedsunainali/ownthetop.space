"use client";

import { useMemo, useState } from "react";
import { formatMinorUnits } from "@/domain/money";
import type { TowerId } from "@/domain/tower";
import { listingsByTower } from "@/mock";
import { towers } from "@/mock/towers";
import { useWorldStore } from "@/state/world-store";
import { mockReaction, nextMockAmount, playMockReaction } from "@/components/shell/mock-reactions";

export function ClaimPanel() {
  const [amountMinor, setAmountMinor] = useState(10000);
  const [towerId, setTowerId] = useState<TowerId>("companies");
  const [category, setCategory] = useState("");
  const [showCategoryError, setShowCategoryError] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const selectTower = useWorldStore((state) => state.selectTower);
  const soundEnabled = useWorldStore((state) => state.soundEnabled);

  const estimatedPosition = useMemo(() => {
    const above = listingsByTower[towerId].filter((listing) => listing.totalPaidMinor > amountMinor).length;
    return Math.min(above + 1, listingsByTower[towerId].length + 1);
  }, [amountMinor, towerId]);

  const currentTop = listingsByTower[towerId].find((listing) => listing.rank === 1);
  const changeAmount = (direction: -1 | 1) => {
    const next = nextMockAmount(amountMinor, direction);
    const response = mockReaction(next, currentTop?.totalPaidMinor ?? 0);
    setAmountMinor(next);
    setReaction(response.copy);
    if (soundEnabled) playMockReaction(response.sound);
  };

  return (
    <section className="claim-panel" aria-labelledby="claim-heading">
      <div className="claim-headline"><div className="claim-panel__intro"><span className="eyebrow">The skyline is a leaderboard</span><h1 id="claim-heading">Own the top floor for</h1></div>
      <div className="amount-control">
        <button type="button" aria-label="Decrease mock amount" onClick={() => changeAmount(-1)}>−</button>
        <div><span>Ranking power</span><strong>{formatMinorUnits(amountMinor)}</strong></div>
        <button type="button" aria-label="Increase mock amount" onClick={() => changeAmount(1)}>+</button>
      </div></div>

      <div className="claim-fields"><label className="field-label">
        <span>Website or profile</span>
        <input type="url" placeholder="yourcompany.com" aria-label="Website URL placeholder" />
      </label>
      <label className="field-label">
        <span>Category / tower</span>
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
      <label className="field-label"><span>Category</span><select value={category} aria-label="Category" aria-invalid={showCategoryError && !category} required onChange={(event) => { setCategory(event.target.value); setShowCategoryError(false); }}><option value="">Category</option><option value="technology">Technology</option><option value="creative">Creative</option><option value="commerce">Commerce</option><option value="other">Other</option></select></label>
      <button className="primary-button" type="button" onClick={() => { if (!category) { setShowCategoryError(true); return; } selectTower(towerId); }}>OWN THE TOP</button></div>
      {showCategoryError && !category ? <p className="claim-error" role="alert">Choose a category to preview your claim.</p> : null}

      <div className="claim-stats">
        <span>Current top <strong>{currentTop?.name}</strong></span>
        <span>Required amount <strong>{formatMinorUnits((currentTop?.totalPaidMinor ?? 0) + 1)}</strong></span>
        <span>Estimated position <strong>#{estimatedPosition}</strong></span>
      </div>

      <p className="phase-note">Pay more. Rise higher. Stay visible. Demo only — estimated rank is not a guarantee; no payment is taken.</p>
      {reaction ? <p className="mock-reaction" role="status">{reaction}</p> : null}
    </section>
  );
}
