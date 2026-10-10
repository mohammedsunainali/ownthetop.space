# Phase 2.3 after audit — local, unapproved

This pass remains on `recovery/phase-2-v2-facade` after safety checkpoint `1bb38fa`; no remote state was changed. Evidence images are in `qa/phase-2-3/`. The supplied October 8 screenshots are the before visual record. A fresh, instrumented before renderer capture was not made, so the older Phase 2.2 numbers are historical comparisons only.

## Measured changes

| Contract | Before | After |
| --- | ---: | ---: |
| Floor pitch / wing physical width / clear height | 0.72 / 2.07 / 0.5208 world units | unchanged |
| Wing advertising height | 0.395808 units | unchanged |
| Nominal wing seam dead zone | 0.1656 units (8%) | 0.2484 units (12%) before footprint taper |
| Nominal usable wing width | 1.8216 units | 1.7388 units before footprint taper |
| Wing logo plaque side | 0.16624 units at content scale 1 | 0.197904 units at scale 1; 82% lower bound |
| Logo texture padding | 18% each edge | 10%; display-time transparent-margin crop |
| Nose logo plaque ratio | 55% of ad height | unchanged |
| Wing media canvas | 1536px wide | unchanged; Montserrat text and font-ready redraw |
| Name / subtitle / rank font on canvas | 19% / 8.5% / 18% of canvas height, subject to fitting | preferred 31% / 11% / 20% of bounded type height, with 19% / 8% name/subtitle minima |
| Hiring | small texture pill and occluded nose badge | shallow physical wing sign; none on nose |
| Overview max camera distance | 240 units | 1.13 × overview pose offset (desktop nominal ~132 units for 50 floors) |
| Selected-floor minimum / maximum | 4 / 240 units | 2.4 / 10 units |
| Overview target (normal 50 floors) | 0.5 × tallest height | desktop 0.9 × tallest; mobile 0.58 × tallest |
| Outer surface radius | 65 units | 25.5 units |

The exact rendered font pixel sizes depend on floor footprint, camera projection and viewport. They were inspected in persisted browser screenshots, not inferred as fixed CSS pixel values. The desktop 1728×1117 middle-floor and non-hiring screenshots show normally oriented independent advertisements, visible rank/value, and a clean V seam. The drawer changes from Juniper/HIRING to Copper Cloud/no HIRING without stale state.

## Browser evidence and performance

- Day/night normal overview, Companies/Products/People selected floors, Juniper middle floor, Copper Cloud inactive-hiring floor, 768px tablet, 375/390/430px mobile, 220-floor stress and 2D fallback are saved in `qa/phase-2-3/`.
- Normal 1440px overview: 730 draw calls, 166,054 triangles, 289 geometries, 19 textures. Historical Phase 2.2 report: 726 / 165,766; not an exact matched fresh before capture.
- Mobile 390px overview: 661 calls, 131,194 triangles, 283 geometries, 17 textures.
- Browser application error log was empty on the inspected scene.

## Not yet proved

- The requested 30-state visual matrix is incomplete: no persistent same-camera before capture, full helicopter cycle, ten-reset/ten-selection repetitions, complete 360° orbit, every logo shape/long-name edge case, 900px viewport, or measured FPS distribution on a physical mobile device.
- The 220-floor fixture renders after stress-specific fog bounds, but its overview remains extremely needle-like.
- The dark crown-to-floor transition remains visually heavy; tower geometry is outside this pass.
- `pnpm audit --prod` could not complete because the npm registry DNS lookup failed. `source-map-js@1.2.1` remains in the production graph through Next → PostCSS; the advisory requires separate release review.
