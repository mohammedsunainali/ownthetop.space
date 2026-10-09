# Phase 4.3 implementation tracker

Local only. Branch `recovery/phase-2-v2-facade`, starting SHA `39432a0ea193b5123094f275c96b63d829d71bc2`. Existing tracked/untracked Phase 4.2 work preserved. No push, merge or deployment.

## Current gate

New city density is gated on focused-navigation measurement and correction/mitigation. Manual physical-device checks are separate launch gates, not a blanket implementation blocker.

| ID | Status | Task / acceptance | Sources/tests/evidence | Blocker |
|---|---|---|---|---|
| P00 | [x] | Verify source, recovery archives, facade hashes, 109-test baseline | Existing handoff and backup manifest; preflight archive SHA `6b86cc318b782ebc7f0a847d6b4e9777bdfacaee2c9646d05da1d7e0004b5a56`; gzip integrity passed | None |
| P01 | [x] | Real focused wheel traversal baseline | CameraController, RendererDiagnostics, navigation-performance; qa/phase-4.3/performance | App instrumentation, not DevTools CPU trace |
| P02 | [x] | Evidence-backed trailing-wheel cancellation root cause | phase-4.3-scroll-performance-audit.md; before-trailing-wheel.json | Cold stalls separately pending |
| P03 | [x] | Preserve accepted movement during sub-threshold wheel input | CameraController.tsx/.test.ts; 25 focused tests | None for reproduced defect |
| P04 | [x] | Matched warm before/after camera completion | Production1440×900 DPR1; before/after-matched and trailing-wheel JSON | Does not close global hardware performance |
| P05 | [?] | All tower navigation regression states | Products/People #2 profile checks; camera/store/sightline tests | Side/stress/physical input matrix pending |
| P06 | [x] | Separate truthful Crown demo contract | domain/crown.ts/.test.ts; state/crown-store.ts; preview does not mutate listing | Real commercial rules require approval |
| P07 | [?] | Transparent furnished Crown architecture | RectangularRooftop.tsx; aircraft/rooftop tests; crown/day and night-preview screenshots | Full responsive/video/character collision acceptance pending |
| P08 | [?] | Original Crown billboard, accessible unpaid preview | CrownPanel.tsx; AppShell.tsx; crownCopy; browser preview/clear verified | Focus restoration/mobile matrix pending |
| P09 | [?] | Reusable anchored bubble | CharacterSpeechBubble; speech-layout tests; characters/companies-bubble.jpg | Full keyboard/responsive/side matrix pending |
| P10 | [?] | Mascot deliberate activation, no ad obstruction | Approved GLB unchanged; production click did not change rooftop mode; auto-dismiss observed | Mid-floor and edge matrix pending |
| P11 | [?] | Three contextual original mascot clones | MascotSlot; Tower/TowerShell/RectangularRooftop | Products/People visual interactions next |
| P12 | [?] | Environmental palette/material catalog | city-archetypes.ts/.test.ts; visual-identity before/after1440 | Controlled1728 comparison pending; unmatched shots labeled |
| P13 | [~] | Category-colored lobby lintels, glass doors and thin frames | TowerEntrance.tsx/.test.ts; TowerShell; all geometry below bottom ad | Production visual acceptance pending; protected facade hashes unchanged |
| P14 | [~] | Eight material families with bounded architectural detail rhythms | CompanionSkyline; city-archetypes; city-details.ts/.test.ts; no new buildings | Production visual acceptance pending; original three massing envelopes retained |
| P15 | [~] | Functional signals/crossings on actual ring-road route | traffic-flow.ts/.test.ts, TrafficCrossings.tsx, CityLife.tsx | New production browser cycle acceptance pending; outer junctions remain decorative |
| P16 | [?] | Six shared car/compact/bus/truck/van/scooter silhouettes and riders | CityLife; traffic-flow six-model tests; actual-length spacing; same14/7 count | Full cycle visual acceptance pending; not detailed imported models |
| P17 | [x] | Evaluate justified flyover; deferred without safe route/composition prerequisites | phase-4.3-city-life.md; current outer grid has no functional entry/exit traffic | No flyover implemented; revisit with supported routes |
| P18 | [~] | Shared procedural limbs, waiting and signal-controlled crossing | CityLife, traffic-flow crossing tests; two crossing people | Production visual motion/grounding acceptance pending |
| P19 | [~] | Three canopy forms within existing conservative bounds | WorldProps; existing vegetation/sightline tests; no extra trees | New production visual acceptance pending; further garden/flower detailing pending |
| P20 | [~] | Matte secondary architecture, selective night windows, warm Crown interior | CompanionSkyline, RectangularRooftop; protected ad materials/art unchanged | Latest day/sunset/night browser matrix pending |
| P21 | [ ] | Licensed optional sound extensions | Existing engine preserved, exact licenses | Asset research pending |
| P22 | [x] | Stable secondary demo inventory contract | district-building.ts/.test.ts; district-inventory.ts; world-store | Real commerce requires product approval |
| P23 | [?] | Selectable unpaid building preview | DistrictBuildingPanel; BuildingPreviewSign; CameraController; CompanionSkyline; controls; secondary-buildings/preview.jpg/json build jMEqKUQnpVQUcmsviJyGu | Browser preview/clear/reset passed1280×720; all-building/occlusion/responsive matrix pending |
| P24 | [~] | Responsive/accessibility regression | latest-* evidence at375/390/430/768/900/1440/1728; phase-4.3-visual-qa.md | Narrow-mobile3D subtitles6.46–7.49px fail reading acceptance; full keyboard/fallback matrix pending |
| P25 | [~] | Physical trackpad/pinch/upload acceptance | User confirms trailing-scroll pause gone; real device/user-assisted checks | Genuine pinch/touch/upload remain unverified; capability limitations |
| P26 | [~] | Explicit production220-floor QA fixture; memory/performance/security | fixture-mode tests, claims disabled; performance/stress/rank6.jpg and trailing-wheel.json | Warm120FPS atDPR1.75; cold max216ms long task; full memory/top-bottom/side matrix pending |
| P27 | [~] | Visual comparison/release blockers | phase-4.3-visual-qa.md; launch-readiness.md; current1440/1728 counterparts | Full video/device matrix pending |
| P28 | [~] | Current milestone handoff; full phase not complete | phase-4-continuation-handoff.md latest4.3 section | Remaining implementation and release gates explicitly open |

All pending tasks require exact source/test/evidence links as implementation proceeds. Compilation alone is not visual acceptance.
