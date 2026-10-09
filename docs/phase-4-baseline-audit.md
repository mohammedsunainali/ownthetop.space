# Phase 4 baseline gate — unresolved regressions, 9 October 2026

## Final status for this continuation — authoritative over earlier entries

Current production build `fkXALPAg2pOh85w0-CE99`, Next16.3.8, running on127.0.0.1:3002. Source/runtime build was restarted after every production change. Automated lint/typecheck/build/diff/audit gate passed; final additional rear-sightline unit test also ran:75 tests/21 files pass. No browser error logs in the inspected final page session. Primary facade hashes remain unchanged.

Additional confirmed regressions found during actual browser inspection and fixed: rapid Rotate actions sampled intermediate camera frames; viewport/drawer changes reused an obsolete fit distance; rear bottom-floor traversal bypassed canopy checks. Toolbar input now accumulates intended destinations; safe-rectangle changes trigger a new fit; rear canopy avoidance preserves horizontal heading and raises the approach geometrically. `companies-24-rear-refit.jpg` is a genuine FAILED before capture; `companies-24-rear-clear.jpg` is the inspected final clear after capture.

Latest front tablet measurement after the safe-area refit: build9Nwx (same framing code as current),768×1024, Companies1,736×507 usable region, facade615.55px/title27.05/subtitle13.83/logo76.94. Diagnostic projections always measure the FRONT face: rear-oriented measurements must not be described as rear texture sizes. Current-build tablet screenshot is also saved separately. Narrow375 front refit measures287.88px/title12.65/subtitle6.47; this is an outstanding mobile readability limitation, not acceptance. Mobile drawer scroll was exercised: scrollTop0→208.5, selected rank stayed1.

Latest build's rear Companies24 camera was actually inspected at[-0.426,4.510,-11.758], target[0,1.472,0.4]; logo/name/subtitle/rank/amount are unobstructed and profile matches Skyline Venture04/$138.10. Keyboard traversal23→22 and close/reopen retained correct hiring/profile state. Current full-orbit recording `orbit-current.mp4` belongs to kRl build, not this final rear correction. Six sampled orbit times were inspected; a clip's existence alone is not complete acceptance. All three0ZU top-to-bottom recordings are retained and remain separately labeled.

Phase4 Stage1 is implemented but its complete acceptance gate remains OPEN. Actual physical touch/trackpad, logo upload (explicit browser denial), exploded/stress production-browser matrix and mobile readability/performance remain unresolved. Stages2–7 are not implemented. A precise user-assisted request for pinch/trackpad and upload checks has been sent. Do not integrate later risky world features until these critical checks pass or the user explicitly reviews their scope.

## Latest continuation — current implementation and evidence

This section supersedes the historical preview, dependency and correction statuses below. Production localhost access works. The user-started build H29irSENkRUmC6hFJVOaJ was inspected, then a verified server restart loaded the navigation changes. Latest inspected build: `0ZUgcIyQxKWGBWlMvEBm4`; a subsequent rapid-toolbar correction is rebuilding and is not yet visually accepted.

Starting/current protected HEAD remains `39432a0ea193b5123094f275c96b63d829d71bc2`, branch recovery/phase-2-v2-facade. All Phase4 implementation/evidence remains local and uncommitted. Phase3 backup hash was reverified. Additional complete pre-navigation backup: `/private/tmp/ownthetop-phase-4-pre-navigation-20261009.tar.gz`, SHA256 `d55d5a8462495f494aeaa8286eb9f1872b76b44cc01f9e5e4cf91f804b080047`; archive listing validated.

Implemented: canonical listing-ID traversal, synchronized profile, independent drawer visibility, focused Floors/Zoom mode, normalized wheel traversal, scoped keyboard navigation, measured UI safe area, projection offset retaining a real orbit pivot, and geometric canopy sightline checks. No trees removed. All three frozen primary source hashes still match. Exact details and limitations are in phase-4-camera-and-interaction.md.

Current production screenshots were actually inspected: tablet768 and900, mobile375/390/430, desktop1440, Atlas Grove#12 and all three bottom floors. At768, usable rectangle736×507; facade456.73CSSpx, title20.07, subtitle10.26, logo57.09. Historical failed values were210.57/9.25/4.73 respectively. Mobile subtitles remain physically small (about8–9px); readable profile text supplies details, but physical-device acceptance is outstanding.

Desktop Atlas Grove#12 now matches its profile ($794, correct website/category/location). Companies#24, Products#14 and People#14 identity/price information is visible above foreground greenery. People bottom-panel lower edge can still touch foliage at some viewpoints; arbitrary-orbit occlusion is not globally solved.

Fresh top-to-bottom recordings: qa/phase-4/floor-traversal/{companies,products,people}-current-build.mp4, with original timestamped frames. Build0ZU,1440×900,24/14/14 synthetic fixture, production Codex IAB. Recordings exist; exhaustive timestamp acceptance remains pending. Individual final bottom images and rank12 were inspected. Reset still shows the original sparse district; world expansion has not begun.

Automated gate before final toolbar correction: lint/typecheck/build/diff pass,74 tests across21 files pass. Fresh accessible production audit initially confirmed7 advisories; smallest compatible updates Next16.3.8/eslint-config-next16.3.8 and source-map-js1.2.2 override were installed and tested. Repeated `pnpm audit --prod` returned exit0, no known vulnerabilities. This is not a guarantee against undisclosed issues.

No-logo unpaid claim preview was inspected. File upload was explicitly denied by browser capability; no workaround attempted. Development-browser3000 denial remains respected. Genuine pinch/physical-device behavior, upload, stress-browser QA, full helicopter clearance and matched performance distributions remain incomplete. Do not claim Stage1 complete or launch readiness. No side/rooftop/city/atmosphere/audio/conversion expansion has been integrated past this acceptance gate.

## Continuation update — supersedes initial preview-blocked status below

An externally started production server became accessible on127.0.0.1:3002 (PID69871). Loaded browser chunks match buildygohx-tHiFjUbVU-CrD6TA. Fresh production evidence is saved in qa/phase-4/baseline; historical images were not relabeled. Scene captures use24/14/14 synthetic listings, Codex IAB, production mode, with actual viewport/camera/renderer diagnostics in companion JSON. Edge captures use the isolated synthetic `/dev/rectangular-floor` page at1440×900.

- Final340px price region: Companies1440 and1728 inspected with correct star logo. At1440, facade727.94CSSpx, name31.99, subtitle16.35, amount33.41; at1728, facade921, name40.47, subtitle20.69, amount42.27. Desktop primary layout remains approved.
- Tablet768×1024 FAIL: right drawer leaves252px usable width; facade210.57CSSpx, name9.25, subtitle4.73.
- Mobile375×812 and430×932 inspected: bottom drawer avoids covering ad, but physical text remains small (subtitles6.47/7.51CSSpx).390 capture saved; fresh image inspection still pending. No physical-device performance acceptance claimed.
- Middle-floor FAIL: arrow traversal reaches Atlas Grove#12 while drawer remains Northstar#1 (`companies-middle-stale-profile-1440x900.jpg`).
- Bottom-floor FAIL: foliage covers#24 logo/name/subtitle, drawer also stale (`companies-bottom-occlusion-1440x900.jpg`).
- Edge-case images inspected: representative, short/two-word/long/unbroken names,100-character subtitle, large decimal amount, wide/transparent/missing/invalid logos, non-hiring. Text stays bounded, $123,456,789.99 remains exact, non-hiring has no slate.
- `orbit.mp4`:22.546-second actual browser capture,540 timestamped frames,10×36° Rotate actions. Saved, but complete meaningful-timestamp review remains pending.

First narrow baseline correction implemented: focused tablet601–900px drawer and controls reuse bottom layout; camera classifies actual overlay rectangles independently of GPU quality. Added overlay regression tests. No approved primary facade source/grid/typography changed. Development-browser access to127.0.0.1:3000 was explicitly denied; stopped that path without workaround. Correction is NOT visually accepted yet. After evidence requires restarting the newly built production preview from a user-controlled terminal. Other failures and the remaining baseline matrix still block new feature stages.

The sections below preserve the original setup history. Their empty-baseline/preview-blocked statements are historical, superseded by this update; outbound advisory access and launch acceptance remain unresolved.

### Fresh automated validation after tablet correction

`pnpm lint`, `pnpm typecheck`, `pnpm test` (67 tests /20 files), `pnpm build` and `git diff --check` all ran successfully. New build ID: `p48bzj6IBw8MWUUNNgAWd`. Primary source SHA256 guards remain unchanged. Three.js CommonJS deprecation warnings occurred in tests; no test failed. `pnpm audit --prod` encountered registry DNS ENOTFOUND and retries; this is NOT an audit pass. No dependency version or lockfile changed.

Ending local SHA remains39432a0ea193b5123094f275c96b63d829d71bc2; correction and Phase4 evidence/docs are uncommitted. No push/merge/PR update. Restart the production server after this build before inspecting changes; the old running process is not valid after evidence for the new artifact. The source correction is not accepted until the768px after screenshot and responsive regression views are inspected.

## Verified repository and protected state

Repository: `/Users/mohammedsunainali/Documents/Codex/2026-09-30/codex-ownthetop-phase-1-role-you/work/ownthetop.space`.

Starting branch: `recovery/phase-2-v2-facade`. Starting SHA: `2c952ba427541c81f39abc70eeb1f1f4266f5f53`. The reported Phase 3 changes were still uncommitted: 24 modified tracked files plus Phase 3 geometry, fixture, validation page, reports, screenshots, complete helicopter recording and raw timestamped frames. No unrelated changed files appeared in status.

Complete local protection checkpoint: `39432a0ea193b5123094f275c96b63d829d71bc2` (`wip: protect complete Phase 3 state before living skyline refinement`). The working tree was clean immediately after this checkpoint. It includes all Phase 3 source and untracked evidence, including the raw capture frames. No branch switch, remote update, push, PR mutation or merge occurred.

Independent tracked/untracked backup: `/private/tmp/ownthetop-phase-3-complete-before-phase-4.tar.gz`, 91MiB, 1,096 archive entries. SHA256: `1d616b15e3653073819a22ba5ed0781a448a889b1bea751ffaf55ab15778fc47`. Archive listing succeeded; extraction into `/private/tmp/ownthetop-phase4-backup-check.FmYUWj` and recursive byte comparisons of source/docs/QA returned no differences. Build artifacts and node_modules are ignored generated content and are not part of the source backup.

## Production preview gate

The existing `.next/BUILD_ID` is `ygohx-tHiFjUbVU-CrD6TA`; required-server-files.json exists. This is the Phase 3 build, not a new Phase 4 build. Attempted exact command:

```sh
pnpm start --hostname 127.0.0.1 --port 3002
```

The process exits 1 with `listen EPERM: operation not permitted 127.0.0.1:3002`. This is a host-binding restriction, not EADDRINUSE or a reported application compilation error. `lsof` reports an existing Node listener PID58332 on port3000, no listener on3002 or3003. General `ps` inspection is denied by the sandbox. The existing3000 process is a development preview and must not be substituted for newly built production QA without clear labeling.

A precise permission request was made for loopback production-preview binding and outbound advisory/license lookups. The tool returned network:null: no access was granted. There is no approved alternative production environment available in this turn. New 3D implementation must wait for the baseline exit gate.

No fresh production screenshots, renderer metrics, load timing, gesture recordings or Phase 4 visual acceptance are claimed. `qa/phase-4/baseline/README.md` records this intentionally empty baseline. Prior screenshots must not be copied there and represented as fresh evidence.

## Approved facade freeze

No production source files changed during Phase 4 setup. The approved primary contract remains shaft6.8×4.4, facade6.4×1.2, pitch1.35, texture2048×384, Montserrat and physical two-wire hiring slate. The final Phase 3 stats region is340px wide; its actual final-build projection still needs validation.

SHA256 source guards:

| File | Hash |
| --- | --- |
| RectangularAdvertisement.tsx | `657af6bef87fc09efbbf52f14ae8605f58ebd146c017d278be1fbd951b1ba828` |
| rectangular-signs.ts | `e261f9ed076cbed4d5356f0256d6e646532098c3c5f96cd3a779c38b03f2ac4e` |
| rectangular-layout.ts | `06a650fabc64e2e92592f36d702f4f264b8568051785d7a5da4f926c0edf9469` |

A future side renderer should be a separate side-specific implementation, reusing containment/font primitives without redesigning these primary face layouts. Changes to the primary component require a specific verified bug, a narrow patch and before/after evidence.

## Evidence classification and outstanding Phase 3 work

Read both Phase 3 reports. Historical evidence in qa/phase-3 is not uniformly final:

- Companies1440 shows actual star artwork and the pre-final300px price region. It is approved visual direction, not evidence of the final340px measurement.
- Companies1728 predates the asynchronous logo correction and must be recaptured.
- Companies390 shows the corrected hidden-claim safe-space behavior but needs fresh current-build confirmation.
- `before-overview-1440.jpg` is actually1280×720, despite its name.
- Production overview1440 was recaptured after the old-manifest issue; representative floor and Product/People/day/sunset/night images belong to their documented development stages.
- Helicopter.mp4 is a31-second timestamped browser recording; raw859 frames and six sampled stills are preserved. Full collision review remains outstanding.
- Old before/after renderer numbers use different fixtures/viewports/build modes. They are not a matched improvement experiment.

Pending baseline matrix: final stats projection,1728 recapture,768 tablet,375/430 mobile, edge-case name/subtitle/logo/currency selector, middle/bottom floors, claim preview/upload,2D fallback,220 stress,360°orbit, wheel/pinch/touch and interruption/limits, helicopter clearance review, matched renderer baseline. All remain explicitly pending, not passed from source tests.

## Preliminary module plan — no implementation authorized past failed gate

Reuse the one Zustand store, CameraController, rectangular-framing, world-coordinate layout and existing city paths. Current source confirms the wheel mapping is Phase 3 ordinary-wheel zoom/Shift-wheel travel, opposite to the requested Phase 4 focus mapping. This is a planned change after baseline capture, not a current capability claim.

1. Navigation: pure input normalization and rank traversal helpers, consumed by the existing CameraController and WorldControls; exact listing rank/center targets and synchronized profile; geometric sightline checks against existing foliage. No duplicate controller/store.
2. Side media: one left identity face and one right ranking face, initially4.0×1.2 /1280×384; dedicated grids, correct ±90° orientation, shared listing source, bounded LOD caches. Primary front/rear generation stays frozen.
3. Rooftop/district/sky: extend RectangularRooftop, WorldProps, CityLife and BasicEnvironment within existing routes, seeded placements and helipad anchor. Do not add unrelated city assets or road mathematics.
4. Audio/mascot: audit actual local components/assets and reuse the existing system before choosing extensions. License research is blocked by network restrictions. No external sound downloaded or reuse rights asserted.
5. Conversion/security: validate existing honest demo preview first; evaluate a small deep-link/share improvement only afterward. No fabricated metrics. Minimal compatible security remediation follows a successful fresh audit.

The supplied stills show layered vegetation/road blocks and coherent rooftop supports. Previously sampled supplied recordings are documented in Phase 3; no new recording analysis is claimed in this blocked gate. Reference URLs containing authentication/tracking parameters will not be used, saved or copied. Only public base URLs are appropriate.

## Dependency facts / release status

Local `pnpm why` confirms Next16.3.7 → postcss8.5.23 → source-map-js1.2.1 in production. These are unchanged. Earlier seven-advisory results remain historical, unresolved evidence; current patched versions and advisory status have NOT been freshly verified. No lockfile edits or speculative upgrades were made. Network permission is required for a fresh registry audit and verified commercial audio licenses. The previous DNS failure is not a security pass.

Release status: blocked on baseline production preview, pending validation, and unresolved reported high-severity production advisories. Phase 4 features have not been implemented. Prior65-test/build passes are historical, not newly rerun Phase 4 claims.

## Required user action and continuation

Restore permission to bind a loopback server at127.0.0.1:3002, plus outbound HTTPS access to npm advisory data and public license pages. Alternatively, start the production preview in a user-controlled terminal from the repository:

```sh
pnpm build
pnpm start --hostname 127.0.0.1 --port 3002
```

Review URL: `http://127.0.0.1:3002/?diagnostics=1`. Outbound audit access is still separately required. Once available, finish the pending Phase 3 baseline before navigation, then sides, then immersive-world refinements in the approved sequence. Keep all work local.
## Latest Phase4.2 continuation — 2026-10-09

The historical preview/network-blocked and navigation-only statements below are superseded. Production browser access is working; build E8xJC7qwCN2JdJGrOyBq0 was inspected. Triangle, four-side media, district, roof/sky, original opt-in audio, approved mascot and selected-floor sharing/list features now exist locally.108 tests pass; fresh audit reports no known production vulnerabilities. Full launch/manual/performance/media matrix is not accepted. See phase-4-continuation-handoff.md and implementation-tracker.md for current exact evidence and remaining gates; do not treat older failure captures or unimplemented-world statements as current status.
