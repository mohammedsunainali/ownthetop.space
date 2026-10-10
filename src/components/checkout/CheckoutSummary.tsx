"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { towers } from "@/mock/towers";
import { formatMinorUnits } from "@/domain/money";
import { readCheckoutDraft, subscribeCheckoutDraft } from "./draft-transfer";

export function CheckoutSummary() {
  const draft = useSyncExternalStore(subscribeCheckoutDraft, readCheckoutDraft, () => null);
  return <main className="checkout-page">
    <header className="checkout-header"><Link href="/" aria-label="OwnTheTop home"><Image src="/brand/ownthetop-logo-primary.svg" alt="OwnTheTop" width={210} height={45} priority/></Link><Link href="/">Back to skyline ↗</Link></header>
    <section className="checkout-card" aria-labelledby="checkout-title">
      <span className="eyebrow">Your floor · claim summary</span>
      <h1 id="checkout-title">Review your floor</h1>
      <p className="checkout-pending" role="status">Secure payment checkout is being prepared. No payment has been taken and your floor has not been reserved.</p>
      {draft ? <>
        <div className="checkout-identity"><div className="checkout-logo">{draft.logoUrl ? <Image src={draft.logoUrl} alt={`${draft.name} logo preview`} width={80} height={80} unoptimized/> : <span aria-label="Brand initials">{draft.name.split(/\s+/).map(s=>s[0]).slice(0,2).join("").toUpperCase()}</span>}</div><div><h2>{draft.name}</h2><p>{draft.subtitle}</p></div></div>
        <dl className="checkout-details">
          <div><dt>Website / profile</dt><dd>{draft.url}</dd></div>
          <div><dt>Selected tower</dt><dd>{towers.find(t=>t.id===draft.towerId)?.name}</dd></div>
          <div><dt>Category</dt><dd className="checkout-category">{draft.category}</dd></div>
          <div><dt>Hiring status</dt><dd>{draft.hiring ? "Hiring" : "Not hiring"}</dd></div>
          <div><dt>Proposed amount</dt><dd className="checkout-amount">{formatMinorUnits(draft.amountMinor, draft.currency)} <small>{draft.currency}</small></dd></div>
          <div><dt>Estimated ranking · not guaranteed</dt><dd>#{draft.estimatedRank}</dd></div>
        </dl>
        <p className="checkout-note">This is a temporary draft in this browser tab, available for up to 30 minutes. Refreshing keeps it during that time. Pricing, ranking and availability must be confirmed securely before any future payment.</p>
      </> : <div className="checkout-empty"><h2>No available floor draft</h2><p>Your draft is missing, expired or unavailable in this tab. Return to the skyline and create or preview your floor to continue.</p><Link className="primary-button" href="/">Create your floor →</Link></div>}
    </section>
  </main>;
}
