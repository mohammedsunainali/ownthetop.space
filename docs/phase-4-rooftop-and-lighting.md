# Roof and atmosphere continuation — 2026-10-09

`RectangularRooftop.tsx` preserves roof footprint, pool position/edge, helipad/canonical landing anchor, billboard typography/supports and flag. Villa's opaque box is replaced by a rear wall/two side walls and framed transparent front glazing. Existing roof overhang remains. Added contained sofa/table with physical legs, door handle and ceiling illumination using the existing time-responsive material. `RooftopPool.tsx` replaces static water with153-vertex subtle ripples and one bounded procedural swimmer. `rooftop-life.test.ts` samples the complete swimmer envelope inside pool bounds over1000s. Reduced motion freezes ripples/swimming. Existing walkers/loungers/planters preserved.

Build `7iY2_UPVuaFVYEp__QTdq`:97 tests28files, lint/typecheck/production build passed. Detailed day/night roof screenshots and full helicopter cycle acceptance still required. No collision acceptance inferred from compilation or pool tests.

`SkyAtmosphere.tsx` adds a cheap camera-centered gradient, horizon matching fog, and a visible sun/moon mesh sharing `celestialDirection` with the directional light. Day/sunset/night controls and Auto remain. Original gradient was too pale at overview pitch; revised angular transition. `uujCvVpp_Na32HmdqUQ1P` revised day screenshot inspected under `qa/phase-4/city/gradient-revised-day-1728.jpg/json`. Prior `8UgaJXw6Abgw2b4H08L7D` day/night screenshots retained; no shader errors in inspected browser logs. Actual celestial visibility at all headings, sunset QA, night vehicle lights/stars/birds and full lighting acceptance remain pending.

## Approved mascot recovery — asset only, not integrated

Canonical local provenance `design-system/v1/3d/mascot/REMOTE-SOURCE.json` was verified against the connected existing project **OwnTheTop — Canonical Summit Mascot Master**,id`d106d253-ecae-43de-933d-946c322d6c53`,revision3,sceneSequence1,no active mutation. Existing469,212-byte GLB retrieved read-only into `qa/phase-4/mascot/approved-summit-revision-3.glb`,SHA256`1650ed80b600461a99d0907f386b622ea41e80cf38b60774ff7d5c2a503784c1`. GLBv2 has no external images or animation clips. It contains the approved mascot root plus studio ground/cameras/lights; runtime integration must extract only `OTT_Mascot_Root`, not insert the studio scene.

A noncommitting remote inspection render produced `approved-mascot-inspection.png` (768×768). Original remote revision is unchanged. No replacement character generated. `MascotSlot` still intentionally renders nothing until normalization, safe placement and speech interaction have been implemented and visually verified.

## Authoritative continuation update — 2026-10-09

Latest Phase4.2: divided villa glazing/door details, restrained sofa/table, lightweight rippled pool and bounded swimmer, warm interior point light and shared night pool emission. Existing pad/villa/billboard/flag layout and landing anchor preserved. Approved original static mascot integrated; no invented rig/animations. Full32.028s helicopter video sampled33timestamps; rotor AABB clearance through entire cycle unit-tested against villa/billboard for24/50/220 and exploded modes. All-aircraft/props matrix remains open. Latest night roof screenshot reviewed: warm premium glow still requires refinement; do not call it completed architectural/night acceptance.
