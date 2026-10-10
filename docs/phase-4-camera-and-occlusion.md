# Triangle camera and geometric visibility — 2026-10-09

Canonical tower origins are Companies `[0,0,-9]`, Products `[-13,0,8]`, People `[13,0,8]`, rotation zero. Existing exact rank-to-local-Y and exploded pitch remain the source of truth. Tower groups, roof/pad anchors and ruler inherit placement. Aircraft approach offsets are now pad-relative. Full helicopter lifecycle collision review is still required.

`district-sightlines.ts` evaluates 15 finite camera-to-content rays on whichever of the four elevations faces the camera. Conservative vegetation spheres and other tower AABBs are checked. Occlusion correction first preserves heading and changes elevation, then tries bounded heading offsets. An unresolved search returns the original offset and diagnostics remain blocked; this is not a universal visibility guarantee. Manual orbit checks run at bounded frequency. Focused upper polar angle is constrained to prevent own-roof interference.

Overview wheel zooms; focused wheel traverses floors; Shift-wheel zooms; visible Floors/Zoom mode switch and zoom buttons remain. Profile wheel events remain isolated. Current toolbar Rotate uses 36-degree steps; recorded ten-step cycles cover 360 degrees. Continuous animation passes intermediate headings, but the requested static eight-heading acceptance matrix is not yet complete.

Desktop bottom-floor orbit recordings in `qa/phase-4/triangle/` use build `-8gxjcSKbyyPzLxov4G_E`, 1440×900, default 24/14/14 fixture, day and open profiles. Sampled frames reviewed for all three. Top-floor four-face recordings use build `I1e1M49khMlaXtEma0dv0` under `qa/phase-4/side-advertising/`; all six timestamp contact sheets reviewed. Other towers may remain in the background but did not cover the selected advertisement in reviewed samples.

Outstanding: low-rise/large-prop/own-roof collision bounds; complete middle/bottom four-face responsive matrix; actual touch/trackpad; exploded/stress production browser checks; smooth manual correction/near-plane extremes. Unit geometry tests do not replace these checks.

## Authoritative continuation update — 2026-10-09

Latest Phase4.2: finite content rays now include selected tower roof slab/villa/billboard as well as neighbors/canopies/neighborhood. Candidate inspection heights include lower offsets to avoid steep roof obstruction. Eight-heading top/middle/bottom tests pass; three middle time-state orbit timelines reviewed. Not every prop is represented, no foliage fade implemented, exact eight-heading responsive visual matrix remains open. Latest tablet615.98px ad/title27.07/subtitle13.84,375px subtitle6.46 remains release risk. See authoritative handoff.
