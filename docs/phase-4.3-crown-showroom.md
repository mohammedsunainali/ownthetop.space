# Crown Showroom — separate demo inventory

The Companies roof is a separate aspirational showroom **above** the ranked floors. Northstar Foundry remains #1. No price, booking, payment or commercial ownership is implemented.

`domain/crown.ts` defines demo, verified available/reserved/unavailable, and claimed-with-sponsor types. Only demo is supplied by current data. Claimed copy never displays vacancy copy or an unpaid preview in place of the sponsor. `state/crown-store.ts` is ephemeral visual preview text only, independent of world listing state. Tests cover demo labeling, sponsor precedence, bounded preview text and ranked listing preservation.

`RectangularRooftop.tsx` retains the villa/roof/pool/helipad/billboard bounds and anchors. Four low-opacity glass elevations replace opaque walls; narrow posts, warm-stone flooring, lavender lounge seating, a meeting table and a bounded interior walker improve openness. Existing pool/swimmer/terrace/aircraft remain. Billboard copy is original and explicitly demo-labeled. `CrownPanel.tsx` explains the separate inventory and lets users preview/clear a brand message without reservation or payment. Escape/close returns to the overview. Existing overlay measurement includes this profile-layout panel.

Eight targeted domain/rooftop/aircraft tests passed. Existing rotor-clearance analytic tests still pass for24/50/220 floors, normal/exploded pitch. New glazing is inside the same collision bounds, not a new aircraft obstacle. Actual full aircraft video, narrow-device Crown acceptance, seated resident animation and focus restoration remain pending. Production visual inspection in progress on build `i0PNuuiXxI0tJfC4lIL8I`.
