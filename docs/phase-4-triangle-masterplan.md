# Triangular district — implementation candidate

2026-10-09; baseline HEAD39432a0, buildQS1EE8JOCbSvQ2cpbCQNj. Existing tower local shaft6.8×4.4, primary6.4×1.2, pitch1.35, rooftop7.8×6.6 remain unchanged. Previously centersCompanies[0,0,0.4],Products[-8.8,0,0],People[8.8,0,0]; circulation ellipse16×8.65; walkway14×6.45; ground23/25.5.

New canonical source: src/world/environment/district-layout.ts. CandidateCompanies[0,0,-9],Products[-13,0,8],People[13,0,8], all rotation0. Side/apex separation21.4009units, front edge26units. Wider than supplied12/6 candidate to protect focused camera envelopes. No change to floor Y/rank/pitch/scale. Products/People retain existing category color. Local-to-world helper transforms roof/helipad anchors; tower-local ruler naturally inherits placement. Helicopter approach/departure translated from canonical pad, not old world points.

Road27×22, sidewalk/walking24×19, plaza21×15, parkcenter[0,0,3], groundradius36. Road/path meshes and vehicles/people retain shared ellipse mathematics. Nearby buildings moved beyond road with shared exclusion rule. All four facade approaches reserve cross-shaped low-level corridors; no removal of all greenery. Hero camera fits20×15 half-extents plus actual towers, not full distant scenery.

Sightline sampler covers entire primary/side content bounds with15rays, tests conservative canopy spheres and other tower bounds. Camera preserves requested heading before raising or shifting away from actual blockers. This is not yet universal browser acceptance; manual orbit collision behavior and rooftop/low-rise bounds require continued testing. No absolute visibility claim.

## Authoritative continuation update — 2026-10-09

Latest Phase4.2: final implemented positionsCompanies[0,0,-9],Products[-13,0,8],People[13,0,8], rotations0; canonical district-layout drives tower anchors/routes/exclusions. Earlier finite ground radius notes are historical: continuous2000-unit ground plus fog replaces disconnected boundary rings. Latest1440/1728 reset reviewed; towers readable as hierarchy, not yet final hero composition acceptance. Eight-heading geometric sightlines pass; sampled three-top/three-middle orbit timelines supplement earlier bottoms, not complete universal orbit matrix.

## Latest overview refinement — build e_VStwJVe4ji4rbXcoB2H

2026-10-09: CameraController overview now fits only actual transformed tower envelopes, not a broad empty ground rectangle; selected-floor inspection logic remains unchanged. New rectangular-framing regression checks a tighter distance and all projected tower corners inside the usable rectangle.109 tests in33 files, lint,typecheck,build,diff-check and production audit all passed. This supersedes the earlier108-test/E8x build as current runtime. Source and runtime are consistent; final server restarted and ready at127.0.0.1:3002. Primary SHA256 guards reverified unchanged.

Actual inspected evidence: final-review/hero-refit-1440-day.jpg/json and hero-refit-1728-day.jpg/json. Front top-ad projection increased61.05→65.79CSSpx at1440 and84.77→91.70 at1728. These are composition measurements, not close-up legibility or performance improvements. Wider hero composition remains partial acceptance, not completion of responsive/stress/reset/orbit matrix. A rectangular pale/blurred region below the claim area is visible in overview captures and needs compositor/HUD investigation before final visual sign-off; it is not represented as acceptable final output. Earlier30s performance sample belongs to E8x and must not be silently relabeled as the new camera build.

Full Phase4.2 remains incomplete/not launch-ready. Manual and implementation follow-ups listed below remain open. New source/tests, updated reports and hero images are preserved in the final incremental recovery supplement; initial/main archive is not overwritten.
