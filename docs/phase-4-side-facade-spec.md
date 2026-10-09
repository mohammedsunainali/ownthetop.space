# Phase4 side facade — current implementation, 2026-10-09

Latest update supersedes the historical proposal below. `SideAdvertisements.tsx` and `side-signs.ts` now render independent outward-facing side media on every actual/preview floor. Geometry: 4.0×1.2, local x ±3.49; identity rotation −π/2, ranking +π/2. Detailed canvas1280×384, distant320×96. Logo enclosure200px at(36,92), contain-fit170px; identity x272, measured title68→52px, tagline34→28px with a short-line ellipsis. Hiring reserves tagline width and uses one physical two-wire slate on identity only. Rank/payment fit numerically at up to88px, never ellipsized; existing minor-unit formatting unchanged.

Textures are owned by each mounted listing/face/LOD rather than an unbounded global cache. Font/image callbacks have disposal guards; existing safe image URL validation is reused. Floors pass the same listing data and detailed LOD decision; side mesh events bubble to the existing canonical listing selection. Primary source hashes remain unchanged.

Desktop1440×900/day/default fixture: all three top-floor ten-step 360-degree videos saved under `qa/phase-4/side-advertising/`, build `I1e1M49khMlaXtEma0dv0`. Each timeline reviewed at timestamped one-second samples, not every encoded frame. Identity click Blue Orbit Labs#2 correctly updated profile and camera (`identity-click-rank2-verified.jpg/json`). A prior follow-up unexpectedly showing rank#1 is retained as inconclusive evidence; controlled retest did not reproduce it. No browser errors in the latest inspected log sample.

Full responsive/night/media-edge/large-payment and stress browser matrix remains open. Unit tests cover outward orientation, measured text/numeric fit, LOD dimensions and disposal. Implementation is not launch acceptance.

## Historical preimplementation proposal

No side advertisement renderer has been integrated. Front/rear primary files remain frozen: shaft6.8×4.4, facade6.4×1.2, pitch1.35, texture2048×384.

Proposed side contract:4.0×1.2 usable surface,1280×384 texture. Left: contained logo, title, short subtitle and same listing's physical two-wire hiring slate. Right: contained logo, rank above paid amount; no additional hiring slate. Use one listing identity and existing image/font primitives; bounded side-specific cache and disposal, no duplicate store. Place outside existing glazing without intersecting frames; verify plane rotations produce outward normal and unmirrored text. All faces select the same listing ID.

Before implementation inspect the current depth/glazing mesh positions. Font sizes are not accepted until real projected CSS sizes and long-name/large-payment/wide-logo cases are inspected. No source or artwork from reference sites is copied. Stage1 remaining acceptance is documented separately; this document is a proposed contract, not implementation evidence.

## Authoritative continuation update — 2026-10-09

Latest Phase4.2: identity and ranking side media implemented at4x1.2,1280x384 detailed/320x96 distant, x±3.49 outward rotations±PI/2. Shared selection and actual hiring, bounded owned texture lifecycle. Approved primary source guards unchanged. Three top timelines plus Companies/Products/People middle day/night/sunset timelines reviewed; complete media-edge/responsive/large-price/LOD matrix remains open. Side advertisements are not full launch acceptance.
