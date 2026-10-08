# Phase 3 implementation and QA handoff — acceptance incomplete

## Status and recovery

Work remains local on `recovery/phase-2-v2-facade`. Starting SHA: `1bb38faf92e3a5a0963ce422cb61271e184f5792`. Current committed SHA/checkpoint: `2c952ba427541c81f39abc70eeb1f1f4266f5f53`. Phase 3 implementation and QA evidence are uncommitted, with the modified/untracked files listed by `git status --short`. No push, PR update, merge, reset, clean, or branch switch was performed.

The checkpoint preserves Phase 2.3 on top of Phase 2.2. Independent pre-edit backups are `/tmp/ownthetop-phase-3-preedit.patch` and `/tmp/ownthetop-phase-3-untracked-backup.tar.gz`. Review the checkpoint in a separate checkout if rollback is needed; do not reset this dirty tree. See `phase-3-architecture-before-audit.md` for the before architecture and reference observations.

At 23:53 IST, the permission profile changed to restricted networking. Restarting the freshly built production server failed with `listen EPERM: operation not permitted 127.0.0.1:3002`. Earlier production-browser checks succeeded. The most recent build includes the final 340px stats region; that last width adjustment has not been inspected in the production browser. The task is NOT visually accepted or production-ready. Restore local preview permission before continuing the outstanding matrix below.

## Architecture and dimensions

Production dependency path is now `Tower → TowerShell + RectangularFloors → RectangularAdvertisementPair`, with `TowerShell → RectangularRooftop`. The former three-wing/core/TopPavilion components remain as recovery/regression source but are absent from the production tower import graph. No protected reference assets or new dependencies were introduced.

All dimensions are world units:

| Element | Dimensions / placement |
| --- | --- |
| Main shaft | 6.8 width × 4.4 depth, constant footprint |
| Clear primary facade | 6.4 × 1.2, exact 2048:384 aspect ratio |
| Floor module | 1.2 body + .15 slab = 1.35 pitch |
| Slab | 7.04 × .15 × 4.64 |
| Podium | 7.2 × .72 × 4.8 |
| First floor center | 1.47 |
| Floor center | 1.47 + (count − rank) × 1.35 |
| Roof base | .87 + count × 1.35 |
| Exploded mode | Additional .12 between floor centers, derived everywhere |
| Roof deck | 7.8 × .2 × 6.6 |
| Rooftop envelope height | 3.8 above roof base |
| Tower locations | Companies (0,0,.4), Products (−8.8,0,0), People (8.8,0,0), scale 1 |

24-floor roof base is 33.27; 14-floor roof base is 19.77. Companies is exactly ten modules taller. Uniform geometry supports 1/14/24/50/220 counts without count-specific camera patches. Front and rear use separate correctly oriented meshes sharing one texture set; side glazing is not stretched advertising. Instanced bodies, slabs and side panes keep repetitive geometry bounded.

## Advertising grid

`rectangular-layout.ts` is the single physical/canvas contract. Canvas 2048×384; margin 48; logo enclosure (48,64), 256 square; identity starts X340, ends X1640 (X1240 for hiring); stats X1660–2000, right aligned. Name Montserrat 94px, fitted to minimum70, controlled two lines/ellipsis; subtitle46px, minimum40, maximum two lines. Rank/amount start96px and measured fit within 340px. Numeric content is never ellipsized; unusually large amounts can therefore be smaller. The full description remains in the drawer.

Logos contain-fit into a shallow .8-unit rounded white plaque with .035 depth. Missing/invalid artwork uses initials. Transparent assets preserve alpha. No crop/stretch or special upper-floor scaling is used. The main texture is transparent over glazing, not an opaque navy card.

The independent HIRING slate is 1.04×.28×.045 at local (1.30,−.23,.16), mounted at Y.52 with two visible suspension rods. Both faces carry correctly oriented lettering. Slow .012-radian swing is disabled for reduced motion. Non-hiring detailed faces have no slate or mount. Distant LOD omits physical hiring geometry; detailed faces and drawer use the same listing field. This LOD treatment needs final acceptance against the requested visible hiring-state rule.

Production 1440×900 Companies #1 with drawer, before the last stats widening: measured facade728CSSpx, logo91px, name32px, subtitle16.35px, rank34.12px, amount29.15px. The 300→340px stats change targets approximately33px for the amount; this estimate is not a post-change browser measurement. These estimates use font em size projected through the actual facade, not glyph cap height.

## Rooftop and aircraft

Companies has compact villa3.5×1.8×2.6 centered (−1.4,1.1,−1.35), villa roof3.9×.18×3 atY2.05, front structural columns, roof slab supports, terrace handrails, four planters, loungers and two lightweight walking characters. Pool2.25×1.45 at (1.4,.31,1.8), with separate rim. Side towers use coordinated simpler terraces.

Two-sided billboard5.9×1.04 at (−.9,3.22,−1.3), Montserrat164px title `OwnTheTop.space` and64px supporting line. Physical supports X−2.6/.2. Flag preserved on left rooftop. Window illumination and always-readable sign materials support night; no bloom added.

Canonical helicopter origin anchor: `[2.15,.668,−1.75]` relative to roof base. Companies translation adds Z.4. For24 floors, origin is `[2.15,33.938,−1.35]`; pad top is .24 below the origin. Pad radius1.25 is separate from pool, villa and pedestrians. The visible pad and flight target derive from the same anchor. Landing/departure loop is29 seconds and returns continuously to the cruise starting position. Plane/drone routes derive altitude above the tallest actual roof rather than flying through the widened shaft. A31-second timestamped browser capture is saved as `qa/phase-3/helicopter.mp4`; sample frames are saved separately. Collision acceptance still requires inspection across that recording, not only unit-test poses.

## Camera and integration

`rectangular-framing.ts` projects actual box corners onto forward/right/up axes. Required distance is the maximum projected horizontal/vertical extent divided by the available FOV tangent, including corner depth, with1.06 safety margin. Overview fits occupied ground and separate tower/roof bounds rather than the empty sky in one large cube. FOV42°. Safe viewport subtracts visible claim controls, metrics, controls, header, bottom HUD and profile drawer; hidden CSS panels do not reserve space. Resize/mutation/transition observations keep it synchronized.

Focus uses actual listing rank/count centers; rooftop uses its own broad bounds. Safe-viewport center shifts camera and target using front-facade depth. Far clipping derives from tallest height. Overview zoom minimum derives from fit distance, focus minimum5.5, maximum1.3×destination distance. Exponential bounded interpolation handles scripted transitions. Pointer/touch/wheel cancels the script. Scroll/pinch zooms; Shift+wheel and floor buttons travel the shaft. Rotate and zoom commands interpolate rather than snap. Exploded positions, ruler and helicopter use the same extra pitch.

Claim/profile/upload/preview/ranking domain rules were not rewritten. Active demo is confirmed synthetic24/14/14 (52 floors). Original50/20/20 inventory is retained via `regressionListingsByTower` and `?regression=legacy`. Exact220 synthetic stress generator remains unchanged. UI metrics count active synthetic inventory, not paid customers. The original pricing/payment units, ranking and full profile description remain intact.

Environment changes are limited to collision clearance: widen existing road/walkway/plaza X radii, filter trees/shrubs away from new footprints, move the existing ground brand sign to (−13.2,0,3.3), derive fog distances, and adjust window/glass illumination. Existing city, palette, paths, sound, fallback, loading/intro and controls remain.

## Evidence and defects addressed

Persistent directory: `qa/phase-3/`. Files with earlier stage evidence are not all final-build acceptance images.

| Failure / evidence | Root cause and change | After evidence |
| --- | --- | --- |
| Supplied OwnTheTop2/3: split content/seam | Three-wing mesh; replaced production shell/floors with constant rectangular shaft | `companies-top-drawer-1440x900.jpg` |
| Representative logo crop | Old crop-oriented canvas helper; explicit contain-fit | `representative-floor-front-1280.jpg`, Companies drawer |
| Development initials instead of loaded artwork | StrictMode cleanup marked texture inactive; mount reactivation and asynchronous disposal guard | Companies production image shows actual star logo |
| Floor click ignored on sign | Child handler stopped propagation without action; only stop when callback exists | Products and People selected from leaders, Companies profile |
| Mobile advertisement hidden behind panel | CSS-hidden claim still reserved space; computed visibility check + transition observation | `companies-top-drawer-390x844.jpg` |
| Production overview still overlapped claim | Old server manifest after rebuild; restart before QA | `production-overview-1440x900.jpg` after restart |
| Billboard support off roof | Right support too far right; moved toX.2 | Helicopter capture rooftop |
| New Products footprint reaches ground sign | Old fixed −10.8 anchor; grouped sign moved outside shaft | Final code only, awaiting preview restart |
| Exploded focus/navigation mismatch | Old normal pitch in travel resolver; shared exploded calculations | Tests/typecheck; final browser travel check pending |

Inspected production scenes: 1440×900 overview, Companies/Product/People #1 with profile, hiring Companies versus non-hiring Product/People, People day/sunset/night, night overview, Companies crown; earlier-stage390px Companies drawer and1728px desktop. The1728 image predates the corrected asynchronous logo and must be recaptured. The filename `before-overview-1440.jpg` contains an actual1280×720 baseline; it is not a1440 measurement. Some earlier stage screenshots intentionally document failures rather than accepted output.

Remaining required acceptance: final340px stats projection; desktop1728 recapture; tablet768 and mobile375/430; all edge-case selector scenes including wide/transparent/invalid media; middle/bottom floor; claim preview and logo upload;2D fallback;220 stress browser; manual interruption and touch/zoom limits; complete360°orbit recording; helicopter video collision inspection; matched before/after performance experiment. Do not mark these verified from tests or source inspection.

## Validation and performance

Lint/typecheck/build/diff-check passed. Vitest:65 tests in19 files passed, including rectangular indexing/counts, fit bounds, exact numeric currency, original90 listing coverage and helicopter loop continuity. Final lint/typecheck/tests rerun follows the stats-width-only adjustment. No dependencies were added. Existing Three.js Clock/CJS deprecation warnings remain separate from application failures.

Baseline development1280×720,50/20/20 overview:730 calls,166,054 triangles,289 geometries,19 textures, sampled75FPS. After production1440×900,24/14/14 overview with shared front/rear textures:389 calls,39,620 triangles,363 geometries,65 textures, sampled61FPS/123 samples (capture load affects timing). These are DIFFERENT fixtures/viewports/build modes and therefore not a controlled performance comparison. No improvement percentage is claimed.

Detailed media is bounded by a focused neighborhood; distant media512×96 and front/rear sharing avoid2048px textures for all220 floors. One RGBA distant texture is192KiB before mipmaps; high media3MiB plus256px logo256KiB before mipmaps. Actual GPU byte allocation is not exposed by renderer diagnostics and remains unavailable. Geometries/textures are counted from renderer.info; no per-frame React state updates are used. Mobile performance and stress GPU measurements remain pending.

Earlier successful production audit reported7 vulnerabilities (2high,4moderate,1low), including source-map-js1.2.1 GHSA-68fv-2mgg-jv7q (patched1.2.2) and six Next16.3.7 advisories (patched16.3.8): GHSA-3w37-wq28-93x7, GHSA-4jqv-mc3x-m676, GHSA-39w2-rjm5-chcv, GHSA-f87g-xv8r-7p7x, GHSA-mcj8-r9mp-w47p, GHSA-cjq9-62q9-8jv4. Latest rerun under restricted networking reports ENOTFOUND registry.npmjs.org. DNS failure is NOT an audit pass, and earlier advisories remain unresolved. Security fixes must be validated separately.

## Review / continuation commands

Run from `/Users/mohammedsunainali/Documents/Codex/2026-09-30/codex-ownthetop-phase-1-role-you/work/ownthetop.space` after restoring preview networking:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
git diff --check
pnpm audit --prod
pnpm start --hostname 127.0.0.1 --port 3002
```

Production: `http://127.0.0.1:3002/?diagnostics=1`. Representative/edge cases: `/dev/rectangular-floor`. Regression: `/?regression=legacy&diagnostics=1`. Fallback: `/?fallback2d=1`. Development stress: run `pnpm dev --hostname 127.0.0.1 --port 3003`, then `http://127.0.0.1:3003/?stressFloors=220&diagnostics=1`.

Resume by restoring server access, inspect final build, execute pending matrix, record orbit, inspect landing video, produce matched renderer comparison, resolve actual failures, then update this report. Keep implementation local until user approval.
