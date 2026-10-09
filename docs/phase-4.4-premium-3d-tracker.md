# Phase 4.4 premium 3D tracker

Active project: `/Users/mohammedsunainali/Developer/ownthetop.space`. Branch `recovery/phase-2-v2-facade`, baseline `960ef95317e507958dcae891c36e59362b6ebcca`. Both Developer and home clones initially clean at that SHA with the expected GitHub origin. Historical checkout is read-only; its existing port 3002 server is not this checkout. Active production QA uses port 3004.

## Reference-to-implementation map (before coding)

All eleven supplied screenshots reviewed. Bengaluru images 1–3 show softened pale building corners, varied pitched/flat roofs, clustered rounded/conifer trees, rounded compact/bus/truck silhouettes and diffuse directional grounding. Token Town images 4–11 show layered cornices/awnings/roof equipment, inset windows, terrace furniture, warm interior light against cool ambient fill and deliberately proportioned walking residents. Its strongest bloom/DOF frames wash out signs: those effects are unsuitable for our protected advertisements.

| Reference quality | Original OwnTheTop implementation candidate | Constraint |
| --- | --- | --- |
| Soft structural corners | Shared Three.js RoundedBoxGeometry on tower body/slab prototypes | 0 / 0.10 / 0.14 body radius; slab radius capped below half thickness; exact bounds retained |
| Layered secondary silhouettes | Bounded soft corners, chamfered roofs and arched awnings by archetype | Same footprints, preview identity and collision envelopes |
| Miniature painted traffic | Shared rounded bodies/cabins, tires, glazing and lamps | Same six archetypes, routes, signal rules and counts |
| Deliberately modeled residents | Rounded clothing, skin/hair variation, hinged limbs | Shared instancing and one animation loop; mascot asset unchanged |
| Organic landscape | Smooth lobed crowns and restrained foliage variation | Existing canopy/sightline bounds |
| Warm interiors / cool daylight | Material response, restrained lighting, desktop filtered shadows | Advertisement materials stay unlit and toneMapped=false |
| Macro depth | Existing sky/fog and contact grounding first | No default DOF/bloom/AO stack; crisp advertisements on all tiers |

Public Three.js addon docs and installed source inspected. Token Town public page describes day/night, illustrative crowds, shutter and macro DOF; no private source/assets inspected or copied. Bengaluru web reader failed; both live experiences were inspected with the browser. Bengaluru traffic/camera behavior and Token Town storefront/night presentation informed original geometry and lighting. Reference tabs were closed before matched performance measurements. No private implementation was available. No new packages added. Public sources: [RoundedBoxGeometry](https://threejs.org/docs/pages/RoundedBoxGeometry.html), [Bengaluru Traffic](https://blrai.vercel.app/), [Token Town](https://sael.net/token-town/).

## Checklist

- [x] Verify new Developer-folder repository and baseline.
- [x] Establish visual and rendering performance baselines.
- [x] Audit existing geometry/material/lighting architecture.
- [x] Analyze reference screenshots and public implementation techniques.
- [x] Prototype subtle main-tower edge roundness.
- [x] Verify unchanged advertisement geometry and readability.
- [x] Implement softer secondary-building archetypes.
- [x] Upgrade architectural materials.
- [x] Improve daylight lighting and shadows.
- [x] Improve sunset/night rendering.
- [x] Evaluate selective shaders/postprocessing.
- [x] Improve vehicle geometry.
- [x] Improve character models and animation.
- [x] Improve trees and environmental details.
- [x] Refine Crown materials/furniture/lighting.
- [x] Complete before/after visual comparisons.
- [x] Complete performance and regression testing.
- [x] Verify approved facade hashes.
- [x] Complete production browser acceptance.
- [x] Commit and push the accepted work.
- [x] Synchronize the home-folder clone.
- [x] Deliver the final handoff.

## Baseline validation

Locked dependencies restored without package/lockfile changes. Installed Next 16.3.8 client-boundary and Vitest guides read before coding. Independently rerun tests: **136 passing / 42 files**. Baseline build and typecheck pass. Baseline lint and audit also passed. Matched production browser measurements completed; see the Phase 4.4 handoff and committed measurements. Existing Phase 4.3 handoff, tracker, identity and launch report read; earlier reports predate the committed baseline and do not certify Phase 4.4.

## Acceptance limits

Physical mobile/touch/pinch, existing narrow-phone subtitle readability, cold-load latency and long-run memory remain explicit gates. Automated tests do not establish art acceptance. Implementation acceptance is the local production browser review and regression checks recorded in the handoff. These checked items do not certify physical devices, cold network loads or an award-caliber result. The separate launch gates remain open.

## Milestone decisions

1. Shared structural prototypes compared at identical camera/viewport/day: current, subtle and strong. Selected subtle body radius 0.10 and slab radius 0.025; stronger body 0.14/slab 0.04 adds little at normal distance. Original tower bounds and mounting planes retained.
2. Secondary architecture uses three reusable envelopes and arched canopies. Frequent trim uses a low-triangle bevelled extrusion rather than the heavier rounded box. Traffic, residents and vegetation retain instancing and population counts.
3. Lighting uses supported Three 0.186 PCF shadows and a desktop-only 64px PMREM studio environment. No new dependencies, global tone mapping/exposure change or full-screen postprocessing.
4. Transparent advertisement backgrounds exposed changed architectural lighting during matched review. Added separate unlit planar backings beneath the unchanged artwork to stabilize contrast. Protected advertisement source hashes and all asset/data files remain unchanged.
5. Final checks: 142 tests / 44 files, lint, typecheck, build, diff check and production audit pass. Final browser build `a-4ZfDR2twe7xblYlkZRL`; before-rendering comparison build `741grq37ds6kucKWnoIWM`.
6. Evidence and performance costs: [handoff](phase-4.4-premium-3d-handoff.md), [measurements](../qa/phase-4.4/measurements.json). Save/push/synchronization checklist status is verified against Git in the final delivery.
