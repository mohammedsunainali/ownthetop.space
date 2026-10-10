# Phase 4.5 visual acceptance handoff

Status: implemented and production-tested review candidate. Human visual acceptance is pending; no Phase 4.5 commit, push, synchronization, main merge or deployment has occurred.

Active folder: `/Users/mohammedsunainali/Developer/ownthetop.space`. Branch: `recovery/phase-2-v2-facade`. Local and remote baseline remain `0905af8e0f9c95748a56e73f99dc87bdb1886f54`. The separate home clone remains clean at that same commit; the historical Codex workspace was untouched.

Review build: http://127.0.0.1:3004/. [Matched evidence gallery](../qa/phase-4.5/README.md), [measurement records](../qa/phase-4.5/measurements.json), [tracker](phase-4.5-final-visual-polish-tracker.md).

## Visual assessment

The city is visibly greener, roofs are more varied, and the navy dock is substantially slimmer than the previous white menu. Medium angled tower captures show broader, lit corner transitions and smooth slab turnarounds. The protected advertisement faces are still rectangular, flat and readable. At the distant overview, each tower is only about 66 pixels wide: full-width artwork dominates its silhouette, so structural softness is less obvious there than in the medium view. This is a remaining art-acceptance judgment, not a claim that all views achieve the references' visual standard.

The .30 radius was chosen over .24 after rendered 45-degree comparisons. `geometry-phase44-45`, `geometry-selected-45`, and `geometry-strong-45` isolate old/.24/.30 floor geometry within the new pipeline; the true before/after captures use the baseline and final production builds. Ordinary angled captures are approximately 38 degrees and match within 0.003 world units in camera position. Moving helicopters/traffic are not synchronized; reduced-motion geometry prototypes remove that distraction.

Day/sunset/night and Crown day/night were visually reviewed. Pitched terracotta/cafe roofs, curved storefront canopy ends, balconies and softened body outlines are visible in district previews. Fuller foliage and muted clothing give the original miniature style better consistency. The five metric values remain unchanged. Desktop, 768px tablet and 430/390/375px phones were checked; the bottom dock and tablet tower shortcuts no longer overlap. Phone subtitle text remains too small in the 3D overview. A native close-inspection dialog provides a readable transcript and a horizontally pannable magnification of original artwork; Escape restores focus to its trigger.

## Implementation and architecture audit

| Area | Final change and boundary |
| --- | --- |
| Main towers | Shared rounded X/Z extrusion, .30 radius and small .018 cap bevel; four inset instanced corner highlights. Exact outer bounds, floor height/pitch and flat mounting backplates retained. |
| Slabs and podium | Corner radii independent of thin slab height. Thin trims cast shadows but do not receive self-shadow striping. Softer lobby/podium corners retain approved placement. |
| Secondary city | Four shared body envelopes plus one shared pitched roof. Selected roofs replace flat caps without expanding original collision bounds. Existing locations, balconies, entrances, storefront previews and selection persist. |
| Ground and landscaping | Natural four-green palette, low-frequency texture-free meadow variation, one bounded grass-cluster instancer, fuller tree lobes and green shrubs. No full-ground displacement or new textures. |
| Atmosphere and light | Existing sky shader extended to three stops, gentle daylight wisps and sparse night stars. Revised environment-only fog/fill/sunlight, cool road finishes and warm night contrast. Global tone mapping and advertising color behavior unchanged. |
| Vehicles and residents | Shared rounded body/roof proportions, daylight lamp visibility, muted clothing, separate colored arms and merged shoes. Six silhouettes, populations, crossing/signal logic and animation loop counts retained. |
| Crown | Softer roof, pool rim and planters; lavender upholstery, green foliage and restrained glass finish. No physical transmission pipeline; original warm light, helicopter clearance and demo semantics retained. |
| Right controls | Original handlers and Zustand contracts reused in an icon rail with one expanding group; mobile bottom rail, labels/tooltips, native keyboard operation, outside dismissal and Escape focus restoration. Expanding tools are temporary overlays; close them to read the full profile. |
| Left metrics | CSS spacing, typography and translucent capsules only; all five calculations/values untouched. |
| Phone inspection | New native dialog reads original listing content and paints the original protected ad helpers. No changes to approved advertisement source or textures. |
| Diagnostics | Buffered early long-task observation and diagnostic-only first-render CPU timing; original navigation diagnostics retained. |

Next's installed client-component guide was read before edits. No new packages: Next 16.3.8, Three 0.186.1, Fiber 9.8.1, Drei 10.7.9 and Zustand 5.0.15 remain installed. No expensive full-screen postprocessing, transmission, additional traffic or character populations were introduced. Module-owned shared geometry follows the existing cache lifetime; no independent per-building high-polygon allocation. Phone quality tiers still reduce populations/shadows/reflections.

## Matched performance and resource evidence

Production browser, one active QA WebGL tab, desktop 1440×900, DPR 1, same day fixture/camera. Short settled samples are distributions of animation-frame intervals, not GPU benchmark certification.

| View | Phase | FPS | p50 / p95 / p99 ms | Draw calls | Triangles | Geometries / textures |
| --- | --- | ---: | --- | ---: | ---: | --- |
| Overview | 4.4 | 75 | 13.3 / 14.3 / 14.4 | 818 | 236,926 | 632 / 170 |
| Overview | 4.5 | 75 | 13.3 / 14.3 / 14.3 | 829 | 250,048 | 639 / 170 |
| Top floor front | 4.4 | 75 | 13.3 / 14.2 / 15.0 | 291 | 138,124 | 672 / 174 |
| Top floor front | 4.5 | 75 | 13.3 / 14.2 / 14.3 | 292 | 136,578 | 679 / 174 |
| Angled tower | 4.4 | 75 | 13.3 / 14.2 / 15.2 | 297 | 138,314 | 673 / 174 |
| Angled tower | 4.5 | 75 | 13.3 / 13.4 / 13.5 | 302 | 137,074 | 679 / 174 |
| 220-floor overview | 4.5 | 75 | 13.3 / 15.5 / 16.1 | 1,443 | 304,040 | 1,295 / 669 |

Overview triangles increase 5.5%, draw calls 1.3%; texture count unchanged. The 220-floor sample is recorded honestly without a newly matched baseline stress run; the previous Phase 4.4 report used a different frame limit/host session and is not a paired FPS comparison.

Stress-mode wheel handlers measured p95 .10 ms/p99 .20 ms; wheel-to-camera frame latency p95 11.4 ms/p99 17.4 ms/max22.9 ms across 450 samples. Floor down selects rank2 and floor up returns rank1; Escape returns focus to View. Orbit/zoom/reset, all three towers, four ad faces, district previews and reduced-motion navigation were inspected. No observed recurrence of the resolved scrolling pause.

Three repeated top/reset cycles: geometry count 643→643, textures170→170, heap36.7→31.7 MB. This bounds the sampled navigation cycle; it is not proof against every long-session leak. Different visible views legitimately create/dispose textures and geometry. Raw screenshots and QA scripting can affect host memory.

Cold initialization remains a readiness gate. A new-shader initial render measured476.4 ms CPU with a479 ms long task; stress initialization measured485.1 ms with486 ms long task. Later cached production initialization measured168.8 ms first-render CPU; DOM interactive103.4 ms/load end141.4 ms. First-draw compilation/upload is implicated by timing alignment, but no driver trace proves the split. Reflection baking measured31.6 ms in the earlier desktop sample and75.8 ms in stress. Side texture creation/painting was much smaller than the dominant initial render. These local-origin loads reuse browser/driver/network caches; physical-phone cold GPU initialization and real cold-network delivery remain unverified. Warm75 FPS is not a substitute for those gates.

## Advertisement preservation and readability

SHA-256 hashes match the baseline byte-for-byte:

| Protected source | SHA-256 |
| --- | --- |
| RectangularAdvertisement.tsx | 657af6bef87fc09efbbf52f14ae8605f58ebd146c017d278be1fbd951b1ba828 |
| rectangular-signs.ts | e261f9ed076cbed4d5356f0256d6e646532098c3c5f96cd3a779c38b03f2ac4e |
| rectangular-layout.ts | 06a650fabc64e2e92592f36d702f4f264b8568051785d7a5da4f926c0edf9469 |
| SideAdvertisements.tsx | 88ca63bb6149db5b91f4ef51b9855ca7c9d1dea7b73b1d1709711e3ae9dc685b |
| side-signs.ts | 0681c71879570e7cf5e36df5b6977e2777835fec1941e96aee8bc0f321e53153 |

Matched angled front projection: facade716.049→716.110 px, name32.866→32.868 px, subtitle16.083→16.084 px. Front Top-floor subtitle remains23.656 px. Overview projection remains identical; its1.48px subtitles are inherently unreadable. The diagnostic reports no blocking occlusion in the selected captures. Reviewed identity/rear surfaces retain correct art and layout; inherited side typography/truncation was not rewritten. Structural trim remains outside flat ad backplates. Numeric projection estimates measure camera visibility, not OCR certification of every letter.

Listing data, approved logos/text, rank/amounts/HIRING signs, payment/demo distinctions, Crown ownership, sharing, mascot functionality and camera/traffic contracts were not edited. No production claiming or external payments were exercised. Real business/payment/backend/legal readiness gates from the prior launch report remain unchanged.

## Validation and acceptance

Baseline142 tests independently passed. Final146 tests in45 files passed, including meaningful geometry bounds/reuse and dock disclosure/focus/state contract tests. `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `git diff --check` pass. `pnpm audit --prod` reports no known vulnerabilities. Existing Three CommonJS test deprecation warnings remain. Added diff/source scan found no credential patterns. Compact evidence totals about5.7 MB; raw PNGs and reference video frames remain outside Git.

The user must review the three key judgments: visibly softer towers, a lush inviting city, and premium interactive controls. Approval authorizes the next commit/push to the existing recovery branch and safe fast-forward of the clean home clone. Until then, both Git HEADs remain the Phase4.4 baseline and this review work stays uncommitted. No force-push, main merge or deployment.


## Final UX follow-up

The user approved the overall visual direction for continued development and requested four targeted UX fixes. These are implemented and documented in [final UX / checkout handoff](phase-4.5-final-ux-checkout-handoff.md). Fresh validation: 158 tests in 48 files; lint/typecheck/build/diff/audit pass. Original uncommitted visual work retained. Final approval before commit/push/home synchronization remains pending. Earlier performance measurements in this document were not re-certified by the focused UX task.
