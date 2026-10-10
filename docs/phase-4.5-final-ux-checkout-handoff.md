# Phase 4.5 final UX and checkout handoff

Status: implementation and focused QA complete; human final approval pending. Everything remains uncommitted, together with the original Phase 4.5 visual implementation. No push, home-clone synchronization, deployment or main merge performed.

## Verified repository

Active folder `/Users/mohammedsunainali/Developer/ownthetop.space`; branch `recovery/phase-2-v2-facade`; local and remote baseline `0905af8e0f9c95748a56e73f99dc87bdb1886f54`. Prior uncommitted visual work audited and preserved. Home clone remains clean at that baseline. Historical workspace untouched. No dependencies added or changed.

## Implemented UX

- One 190px navy statistics rail on desktop, narrower responsive rail on phones/tablets. The five calculations and labels are unchanged: default demo 52 synthetic floors, 1,112 ft, 24 companies, 14 products, 14 people.
- Create Your Floor retains its X, upload and content fields. Back removed. Both Preview my floor and Continue to checkout use the same validation. Actions wait for logo reading to finish. Form state survives closing/reopening in the current skyline session.
- Preview still uses the existing temporary Three.js floor replacement and camera navigation. Banner now has checkout CTA, unpaid/unreserved disclosure and Close preview. Its validated draft carries unchanged into checkout.
- `/checkout` displays logo/initials, name, subtitle, website, tower, category, hiring, USD amount and non-guaranteed estimated rank. No payment form or payment submission exists.
- Mascot bubble has no X, preserves existing dialogue and tail, begins a 150ms fade after 5.5 seconds and unmounts after 160ms. Reduced motion removes the fade delay. Polite atomic announcement, repeat activation, keyboard trigger focus restoration and existing travel/occlusion behavior retained. Approved GLB unchanged.
- Floor profile has a separate 44px circular X, rank/header clearance, hover/focus styling and Escape dismissal. Focus returns to the opener when available, otherwise the interactive skyline. Existing information, sharing, visit and inspection actions retained.

## Temporary draft transfer

`sessionStorage` key `ownthetop.checkout-draft.v1`, versioned envelope with 30-minute expiry. Nothing is included in the checkout URL or sent to a server/provider. Local raster logo data stays in this temporary same-origin tab storage. Normal same-tab refresh retains the draft until expiry; a missing, malformed, expired or inaccessible draft displays a recovery link to the skyline. Storage/quota failures keep the creation form open with a useful error. Checkout watches expiry while open and cleans up its interval/listeners on unmount. This frontend storage is not authoritative payment or ownership data.

## Future backend integration boundary — NOT implemented

Proposed authenticated request: `POST /api/checkout/sessions`. Provider and API route do not exist yet. Choose a provider before implementing this boundary. Example expected request:

```json
{
  "listing": {
    "displayName": "Nova Labs",
    "subtitle": "Trusted infrastructure",
    "website": "https://example.com",
    "towerId": "companies",
    "category": "technology",
    "hiring": true,
    "logoAssetId": null
  },
  "proposedAmountMinor": 10000,
  "currency": "USD"
}
```

A future upload endpoint must validate file contents/limits, store an approved raster asset and issue `logoAssetId`; never use uploaded base64 or sensitive customer details in a URL. The backend must authenticate the claimant and independently validate/canonicalize content, amount, currency, pricing, current rank and availability. The current estimated rank is advisory, not a reservation or trusted server input. A real backend creates the secure provider session and controls any expiry/reservation policy. Verified signed callbacks/webhooks, idempotent processing, reconciliation and retry handling must update ownership/ranking only after verified payment. No frontend success URL alone can mark a floor paid. None of this backend/provider functionality was implemented in this task.

## Fresh validation for this UX changeset

- `pnpm lint`, `pnpm typecheck`, `pnpm build`, `git diff --check`: pass.
- `pnpm test`: **158 tests / 48 files pass**, including draft validation, direct checkout, preview-to-checkout identity, unchanged inventory, expiry, missing/malformed/quota failures, unpaid summary, mascot timing/reduced motion/cleanup and hiring/non-hiring profile Escape/focus with a long-name test fixture.
- `pnpm audit --prod`: no known vulnerabilities (registry access used after sandbox DNS failure).
- Production build browser: both checkout paths, local PNG upload, correct preview content/hiring/amount, same-tab refresh, modal X state retention and focus, keyboard Tab wrapping, mascot repeat activation/auto-dismiss/keyboard focus/travel dismissal, profile close/Escape, hiring/non-hiring layouts and unchanged metric values checked.
- Responsive viewport checks: 1440×900 desktop, 768×1024 tablet, 430×932, 390×844, 375×812 phones. No horizontal overflow in checkout; long-name checkout reviewed at 375px. Profile rank/X rectangles do not overlap and X remains 44×44. Mobile preview banner clears the bottom dock by 12px and does not cover the selected preview advertisement in the captured view.
- Reduced-motion application fixture and unit timing checked. Browser console has no current errors. DOM/keyboard and emulated pointer checks are not a physical-touch-device or screen-reader certification.
- Existing preview intentionally clamps the rendered temporary floor to the existing tower capacity: proposed rank #25 displays in temporary floor #24 for the default $100 Companies draft; checkout correctly retains the original non-guaranteed #25 estimate. This inherited preview architecture was deliberately preserved.

## Protected contracts and inherited readiness gates

Five protected advertisement sources match their baseline SHA-256 hashes exactly: RectangularAdvertisement, rectangular-signs, rectangular-layout, SideAdvertisements and side-signs. All mock inventory files, approved artwork/assets, navigation camera source and right dock source are unchanged by this UX pass. Compared against a hash manifest captured before these UX edits, the only changed existing `src/world` files are CharacterSpeechBubble and MascotSlot. Geometry, landscape, lighting, traffic, people and Crown refinements remain byte-identical to the initial uncommitted Phase 4.5 visual implementation.

The prior visual handoff's 146-test and rendering/performance numbers describe the earlier review candidate. Current fresh test count is 158. No new GPU benchmark or cold-load certification is claimed for this UI task. Prior cold first-render long tasks, physical-device performance, real cold-network testing and narrow-phone 3D subtitle readability remain inherited readiness gates; existing Read & inspect floor remains available for claimed listings. Payment provider, secure backend pricing/availability, webhook processing and reconciliation remain required before production payments.

## Review evidence and files

Review URL: http://127.0.0.1:3004/. Checkout is reached through either validated creation action or the preview banner. [Compact evidence gallery](../qa/phase-4.5-final-ux/README.md). Raw PNGs remain outside Git in `/private/tmp/ott-ux-evidence`; compact JPEGs total about 1.6 MB, separate from retained earlier visual QA.

Files changed by this focused UX pass:

- `src/app/globals.css`
- `src/app/checkout/page.tsx` (new)
- `src/components/checkout/CheckoutSummary.tsx` (new)
- `src/components/checkout/draft-transfer.ts` (new)
- `src/components/checkout/draft-transfer.test.tsx` (new)
- `src/components/shell/AppShell.tsx`
- `src/components/shell/CreateFloorDialog.tsx`
- `src/components/shell/CreateFloorDialog.test.tsx`
- `src/components/shell/FloorPreviewBanner.tsx` (new)
- `src/components/shell/MetricsPanel.tsx`
- `src/components/profile/ProfileDrawer.tsx` (also contains preserved earlier visual work)
- `src/components/profile/ProfileDrawer.test.tsx` (new)
- `src/domain/checkout-draft.ts` (new)
- `src/state/world-store.ts` (type-only extension)
- `src/world/mascot/CharacterSpeechBubble.tsx`
- `src/world/mascot/CharacterSpeechBubble.test.tsx` (new)
- `src/world/mascot/MascotSlot.tsx` (keyboard focus only)
- This handoff, prior Phase 4.5 tracker/handoff addenda, and `qa/phase-4.5-final-ux/` evidence.

[Complete combined uncommitted changeset manifest](phase-4.5-final-changeset-files.md) includes the preserved original Phase 4.5 implementation. Final human approval is still required before staging/committing/pushing that coherent changeset and safely synchronizing the clean home clone.
