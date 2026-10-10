# Phase 3 architecture before audit

## Local source and recovery

Starting branch `recovery/phase-2-v2-facade`; starting HEAD `1bb38faf92e3a5a0963ce422cb61271e184f5792`. Phase 2.2 is committed there; Phase 2.3 had 17 modified source/test files plus font assets, two audits and QA images. These were inspected and preserved in local checkpoint `2c952ba`. Separate backups: `/tmp/ownthetop-phase-3-preedit.patch` and `/tmp/ownthetop-phase-3-untracked-backup.tar.gz`. Only font-license trailing whitespace was normalized to pass diff-check. No remote mutation.

## Current geometry and dependencies

- `tower-layout.ts`: floor height .62, gap .10, pitch .72; base center 1.17. Three-wing setbacks .62/.78/1 with another 15% normalized taper. Each wing is 1.42 × .62 × 2.28. Nose width1.31, side width2.07; clear height .5208, ad height .395808. Seam dead zone12%, outer4%; wing ad width1.7388 before taper. Crown height is count-dependent, with a6.48-unit tapered spire system.
- `Tower → TowerShell → TowerCore + TowerWing ×3 + TopPavilion`; `Tower → RankedFloors → FloorSign`; `FloorSign → floor-signs.ts` produces nose/logo/independent wing canvases. Instanced structural meshes preserve listing selection via instance-index division by3.
- `WorldCanvas → WorldScene → BasicEnvironment + three Tower instances + CameraController`. WorldScene passes live floor counts to environment/aircraft. `TopPavilion` and helicopter use one `HELIPAD_LOCAL_ANCHOR`, transformed by crown vertical scale and company tower placement.
- Camera overview uses offsets(28,56,100), a height multiplier relative to50 floors and target90% of tallest height on desktop. Selected floor uses(2.2,.36,1.7) and an X shift1.45 for drawer space. This is still unrelated to actual viewport occupancy. Orbit limits: overview16 to nominal~133, selected2.4–10; polar maximumπ/2.05. Manual inputs stop interpolation.
- Metrics, claim, profile and fallback consume `mock/index.ts`; all inventory is synthetic via `createListings`, `.example.test` URLs and deterministic demo seeds. Default50/20/20; exact220-floor stress generator is separate. No persistence or real paid inventory was found. Preserve full datasets, stage24/14/14, then switch demo only after validation.

## Confirmed defects

Supplied OwnTheTop images1–3 show fragmented ads, central stats crowding, small subtitles and a narrow crown. Source confirms geometry creates the limited ad area. Images16–17 are layout suggestions; their capsule hiring treatment is superseded by the request for a physical suspended slate. Screenshot17 also demonstrates price overflow; the implementation must measure currency width in its fixed region.

Fresh baseline: 730 draw calls,166,054 triangles,289 geometries,19 textures, sampled75FPS (browser ceiling), normal50/20/20 development overview. Baseline images saved under `qa/phase-3/`. Screenshot resolution must be recorded from actual capture, not assumed from a requested override.

## References: observations and implementation mapping

All18 supplied still images inspected. Kingfisher images8–13 show a uniform rectangular shaft, strong roof slab, supported overhang, villa glazing, terrace greenery and warm dusk edges. Adapt proportions into an original compact villa/terrace in `TopPavilion`; no source assets reused.

TopFloor63.33s recording sampled at3/12/25/37/50/60s: close paid facade and profile at3/12; rooftop orbit at25; vertical travel midstack at37; lowest floors at50; return roof at60. Names/stats stay in stable columns across views. Adapt continuous facade and measured focus bounds, not its artwork or exact layout.

Bengaluru43.14s recording sampled at2/8/17/25/34/40s: overhead at8, lower road view at17/34, lateral composition at40; vehicles remain aligned with roads. Preserve existing deterministic CityLife paths and avoid expanding to that city's scale. Token Town30.81s recording sampled at1/6/12/18/24/29s: guided focal-store changes preserve a three-quarter view; local warm lamps separate foreground from dim background. Adapt restrained rooftop/window illumination, without copied shops or bloom effects.

Public TopFloor, Token Town, AI Museum and Apple Park loaded and were visually inspected. AI Museum uses stable focal objects and guided camera framing. Apple Park shows a complete circular perimeter and layered landscape. Bengaluru public base URL opened to its loading landing screen; the recordings provide the street interaction evidence. No tokens/tracking URLs used.

## Replacement scope

Shared rectangular dimensions/sign contract, floor instancing, shell/podium, rooftop, layout anchors, bounds-derived camera, aircraft clearances, ruler and synthetic fixture integration. Claim/payment/ranking/profile logic stays attached to existing domain data. Reuse current materials, fonts, loader, quality controls, city and selection APIs. Keep old fixture/recovery source available until replacement browser validation.
