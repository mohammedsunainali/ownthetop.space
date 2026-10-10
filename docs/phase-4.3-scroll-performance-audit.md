# Focused navigation audit — October 9

## Reproduced defect and correction

Production baseline `JDzHuUQE1dqu1dRddmXE_`, corrected `6xSLFNdLCXcHD9uTYChzZ`. Same in-app browser, 1440×900, DPR1, default synthetic inventory, day, profile open, native wheel calls over canvas at (440,500). Twelve calls: eight down/four up, 0.3 page each. Then 0.04 page down immediately followed by 0.005 page down.

The small trailing event canceled an accepted floor transition without selecting another floor. `yieldCameraToManualControl` set transition=0/manual=true **before** checking the 60-pixel threshold. The profile advanced, but the camera stayed short of its destination. Before: Companies #6 target Y26.84225, destination Y25.77 (1.07225 error), projected floor center Y582.98. After: target Y25.77083, destination Y25.77 (0.00083 error), projected center Y460.03. Both selected Common Thread #6. The fix preserves scripted floor travel for sub-threshold input, while still yielding to actual orbit and focused zoom.

Evidence: `qa/phase-4.3/performance/before-trailing-wheel.json`, `after-trailing-wheel.json`, `before-matched.json`, `after-matched.json`, `after-final.jpg`. Primary advertisement files are unchanged.

## Measurements and limits

Warm matched run: input→first camera frame median 5.9ms before / 6.0ms after; maximum 7.8ms / 7.1ms. This is not a claimed FPS optimization: it corrects a canceled animation. Settled two-second windows were ~120FPS on this browser; before p95 9.2ms, after 8.5ms. These settled windows do not represent the complete interaction distribution.

Earlier cold instrumented run `EPujRf26jQK4TFAbg2i4v` had response max176.5ms, frame p95 29ms and long tasks up to208ms. It is **not** a matched warm comparison and cannot establish an optimization percentage. Cold-load/texture/font/GPU attribution needs further tracing. Warm side texture creation max2.3ms; sightline search max0.3ms; wheel handler max0.2ms. No evidence yet supports calling raycasting the dominant bottleneck. Side LOD creates/disposes media when the detailed window changes; do not introduce a speculative unbounded cache.

Instrumentation is opt-in (`diagnostics=1`), bounded at512 samples/metric, uses no per-frame React state. Records wheel handler duration, side canvas paint/create duration, sightline search, accepted input→first camera frame, long-task observation and existing renderer distributions. Counts include page startup. No Chrome DevTools CPU/GPU/React-commit or GC trace is available through the current browser API; these are application instrumentation results, not a fabricated DevTools recording. Physical trackpad/pinch remains manual. Full 220-floor production performance and leak acceptance remain pending.

## Safety / validation

Baseline109 tests passed; focused correction25 tests across3 files passed, including new trailing-input/zoom-authority tests. Lint, typecheck and corrected production build passed. Exact port3002 process was stopped before each shared `.next` build. Current branch/SHA remain recovery/phase-2-v2-facade /39432a0; dirty work preserved. Pre-change archive: `../ownthetop-phase43-preflight-20261009.tar.gz`, SHA256 `6b86cc318b782ebc7f0a847d6b4e9777bdfacaee2c9646d05da1d7e0004b5a56`, gzip integrity passed.

Performance gate: the reproduced interruption defect is corrected. Independent rooftop/interaction work may proceed; global hardware smoothness, cold starts, physical-device input and stress performance are not launch-accepted.

## Production stress / subsequent integration

Build `jMEqKUQnpVQUcmsviJyGu`,1280×720,DPR1.75,default day,explicit `diagnostics=1&stressFloors=220`. Fixture badge and metrics report220 synthetic Companies,0 Products/People; claims are disabled so default pricing estimates cannot be mistaken for stress inventory. Real native wheel traversal/reversal/trailing input reached Fixture Studio006, drawer rank6, camera targetY290.36814 versus destination290.37 (0.00186world error), blocked=false. Warm two-second window:120FPS,p50 8.3ms,p95 9.0ms,p99 10.4ms,max12.3ms,105draw calls,648textures,1345geometries. Input→first camera frame median7.6ms,max11.7ms; wheel-handler max0.2ms. Cold long-task observer recorded four tasks,max216ms. This is a different viewport/DPR/fixture than the matched baseline and must not be used for an improvement percentage or memory-leak acceptance. Evidence `performance/stress/trailing-wheel.json`,rank6.jpg.

Subsequent build `DTa5MFqxQgAhgEdCLDcyh`,1440×900,DPR1,day overview: warm120FPS,p95 9.2ms,755calls,169textures. Startup long task442ms recorded. This is overview integration evidence, **not** focused-scroll or matched cold performance acceptance. New traffic retains the14/7vehicle limit; new building details and tree forms use shared instances and unchanged placement bounds. Full cold CPU/React/GPU attribution remains open; this browser exposes no DevTools profiler or GC trace. Physical-device confirmation requested separately.
