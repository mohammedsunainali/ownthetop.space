# Phase 4.4 premium city rendering handoff

Implemented in `/Users/mohammedsunainali/Developer/ownthetop.space` on `recovery/phase-2-v2-facade`, starting at `960ef95317e507958dcae891c36e59362b6ebcca`. The home clone was initially clean at the same commit; the historical checkout was not modified. This is implementation acceptance from local production QA, not deployment approval or physical-device certification.

## What changed

Shared Three.js RoundedBoxGeometry softens tower bodies (0.10 world units), thin slab trim (0.025), podiums, selected roof caps, railing edges and furniture without enlarging their envelopes. Three matched candidates are retained: [current](../qa/phase-4.4/geometry-current.jpg), [selected subtle](../qa/phase-4.4/geometry-subtle.jpg), [strong](../qa/phase-4.4/geometry-strong.jpg). The QA-only `diagnostics=1&edgeProfile=current|strong` switch changes tower body/slabs within the final lighting pipeline; it is not a full baseline rollback. Subtle won on restrained corner highlights, crisp mounting planes and cost. Roof furniture has its own dimension-appropriate radii.

Secondary buildings use three shared instanced envelopes: small bevels, visible soft corners and chamfered corners. Reusable curved awnings, roof caps, inexpensive bevelled trim and an inset-pane shader add layered architecture. Archetypes retain footprints, placement and selectable demo previews. No independent high-polygon building allocations or imported reference assets.

The six existing vehicle archetypes retain routes, counts and signal behavior. Shared rounded bodies/glazed cabins, painted roof panels, matte round tires and existing lamps improve miniature silhouettes. Residents have rounded clothing, spherical heads, skin/hair variation, hinged limbs and stationary pause poses. Terrace walkers turn smoothly and swing their limbs; existing resident paths remain. Tree canopies combine three lobes or stacked evergreen layers within conservative bounds, with brown trunks and existing foliage variation. The approved mascot asset is unchanged.

Architectural roughness/metalness were balanced for painted surfaces and restrained metal highlights. Crown glass selectively uses MeshPhysicalMaterial with clearcoat, opacity and no transmission. Softer sofa arms/chairs, pool swimmer geometry and recalculated ripple normals refine the terrace. Existing warm interior light, demo inventory and aircraft anchors remain.

Daylight uses a warmer directional sun, softer hemispheric fill, supported PCF shadow filtering and explicit bounded shadow coverage. Sunset/night retain cool fill and selective warm windows. Desktop uses one 64px PMREM RoomEnvironment baked once (typically 29–36ms in normal fixture), disposed on cleanup. Mobile omits it and shadows; stress towers above 80 floors omit sun shadows. Existing mobile populations and DPR tiers remain. No new dependencies, HDRI downloads, full-screen AO/bloom/DOF, physical transmission or global exposure/tone-mapping changes. AgX/ACES migration was rejected here because existing renderer/ad color behavior is an approved contract.

## Advertisement and product protection

Artwork, logos, titles/subtitles, ranks/payments, HIRING signs, domain/customer/demo data, floor pitch/dimensions, camera navigation and Crown claim semantics are unchanged. Main tower source contracts remain 6.8×4.4, floor 1.2, pitch 1.35, flat front/rear artwork 6.4×1.2. No advertising surface is rounded or blurred.

Matched review caught transparent artwork backgrounds exposing newly lit architecture. Separate unlit merged flat backplates sit 0.002 behind the original four mounting planes; one instanced draw per tower, eight triangles per floor, no textures. The sampled approved day backing stabilizes navy contrast under changing light. This preserves artwork and mounting geometry, not pixel-identical screenshots across lighting modes.

SHA-256 checks match baseline exactly:

| Protected file | SHA-256 |
| --- | --- |
| RectangularAdvertisement.tsx | `657af6bef87fc09efbbf52f14ae8605f58ebd146c017d278be1fbd951b1ba828` |
| rectangular-signs.ts | `e261f9ed076cbed4d5356f0256d6e646532098c3c5f96cd3a779c38b03f2ac4e` |
| rectangular-layout.ts | `06a650fabc64e2e92592f36d702f4f264b8568051785d7a5da4f926c0edf9469` |

## Validation and browser review

Baseline independently passed 136 tests / 42 files. Final: **142 tests / 44 files**, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `git diff --check`, `pnpm audit --prod` pass; audit reports no known vulnerabilities. Added meaningful geometry-envelope/resource-budget/backplate tests and diagnostics-only reduced-motion fixture isolation. No package or lockfile changes.

Local production browser build `a-4ZfDR2twe7xblYlkZRL`, baseline-rendering comparison `741grq37ds6kucKWnoIWM`. Matched camera/viewport/day screenshots and diagnostics saved before/after. Both reference sites were inspected visually in the browser and closed before measurements. Tests alone were not used to judge visual acceptance.

Reviewed desktop 1440×900 overview day/sunset/night, selected floor, medium city view, Crown day/night, and all four advertisement faces on all three towers. Rotations use the existing 36-degree control: front 0°, ranking-side 108°, rear 180°, identity-side 288°; oblique side inspections are not orthographic elevations. Tablet 768×1024 overview/selected/Crown, mobile 375×812 selected/overview and 390×844 sunset/night/Crown were inspected. Original narrow-phone subtitle size remains a readability gate; profile/list alternatives remain available.

Verified sharing copies the correct `?tower=companies&floor=companies-01` URL; district and Crown local previews remain explicitly unpaid; character bubbles display; 2D rankings and return to 3D work. Diagnostics reduced-motion fixture held identical traffic phases/time=0 over five seconds while rotate/select remained usable. This tests the hook branch, not an OS preference or real-device accessibility audit. The 220-floor fixture renders, disables claims and navigates to rank #2 by wheel. No error-level browser console messages were observed.

## Measured rendering cost

See [measurement summaries](../qa/phase-4.4/measurements.json) for min/median/max window distributions, loading samples, heap trends and single-wheel latency. Measurements are warm cached local builds in Codex IAB on this Mac at DPR 1; viewport emulation is not mobile hardware. Values below are medians of roughly 17–25 seconds of settled 2-second windows, not a universal performance guarantee or a claim of a statistically significant improvement.

| Matched desktop day | Baseline | Final |
| --- | ---: | ---: |
| Overview FPS | 120 | 120 |
| Overview p50 / p95 / p99 ms | 8.3 / 10.2 / 10.3 | 8.3 / 8.5 / 10.2 |
| Overview draw calls | 783 | 818 |
| Overview triangles | 141,246 | 236,926 |
| Overview geometry resources | 716 | 632 |
| Overview textures | 169 | 170 |
| Selected FPS | 120 | 120 |
| Selected p50 / p95 / p99 ms | 8.3 / 9.85 / 10.25 | 8.3 / 10.05 / 10.7 |
| Selected draw calls | 262 | 287.5 |
| Selected triangles | 91,822 | 174,834 |
| Selected geometry resources | 737 | 652 |
| Selected textures | 171 | 172 |
| Single wheel event to render ms | 7.5 | 7.8 |

Added triangle cost is real: approximately +68% overview and +90% selected, while calls rise about 4.5%/9.7%. Cheap shared secondary trim was chosen after an intermediate version exceeded 265k overview triangles. Warm navigation held refresh rate; the previous floor-scroll pause did not recur during local wheel/rotation tests. Real trackpad confirmation was requested and remains a human gate if not supplied.

| Other matched tiers | Baseline | Final |
| --- | ---: | ---: |
| Fresh mobile overview FPS | 120 | 120 |
| Mobile p50 / p95 / p99 ms | 8.3 / 9.4 / 10.25 | 8.3 / 9.3 / 10.35 |
| Mobile calls / triangles | 716 / 107,064 | 728 / 152,746 |
| Mobile geometries / textures | 672 / 167 | 588 / 167 |
| 220-floor overview FPS | 120 | 120 |
| Stress p50 / p95 / p99 ms | 8.3 / 9.95 / 10.3 | 8.3 / 10.4 / 10.7 |
| Stress calls / triangles | 1,424 / 162,070 | 1,436 / 261,958 |
| Stress geometries / textures | 1,372 / 670 | 1,288 / 669 |

Mobile triangles rise about 43%; calls about 1.7%. These are viewport-tier measurements on desktop GPU. The earlier resize-only mobile trace is retained separately; the fresh-page comparison excludes previously allocated desktop shadow resources. Mobile has seven vehicles, reduced background/people/tree populations, no environment reflection bake and no shadows. The stress fixture has substantially more ad textures from existing LOD/inventory; rounded geometry is shared across all 220 floors.

Heap samples show GC fluctuations rather than monotonic desktop idle growth: baseline overview 66→61MB, final overview 43–69MB. Six tower/Crown/time switching cycles held textures at 174 and returned geometry counts from 672 to 629, with heap 32–44MB. Short sampling does not establish leak freedom; long-run profiling remains open.

Normal final cached loads observed initial main-thread long tasks around 143–154ms, with one earlier intermediate build at 537ms. A first stress load observed a 1,810ms long task and an 82ms reflection bake. A repeat final stress navigation observed 162ms maximum long task and a 67ms bake; the first-load spike was not repeated but remains a cold-load concern. These must not be hidden by settled FPS. NavigationTiming/resource-transfer entries reflect cached HTML/resources, not full uncached 3D readiness or cellular loading. Cold cache/network, driver shader compilation, physical mobile/touch/pinch and sustained memory/thermal behavior remain launch gates.

## Evidence and delivery

Committed compact evidence: 20 review images plus small measurement summaries (about 2.3MB). Start with [before overview](../qa/phase-4.4/before-overview-day.jpg), [final overview](../qa/phase-4.4/final-overview-day.jpg), [selected floor](../qa/phase-4.4/final-selected-day.jpg), [Crown night](../qa/phase-4.4/final-crown-night.jpg), [secondary cafe](../qa/phase-4.4/district-cafe.jpg), and [mobile](../qa/phase-4.4/mobile-selected.jpg). Full raw matrix, intermediate milestones and per-window traces are preserved separately at `/private/tmp/ownthetop-phase-4.4-evidence`; intermediate `after-*` images precede the final ad backplate protection and are superseded by `final-*` images. The before/after scene is dynamic; vehicles, residents and aircraft are not frame-synchronized.

The tracker records local implementation acceptance. The final response reports the verified commit/remote SHA and clone synchronization. No merge to main or deployment is authorized by this handoff. Physical-device/cold-load/readability gates remain open, and an award-caliber claim is not made.
