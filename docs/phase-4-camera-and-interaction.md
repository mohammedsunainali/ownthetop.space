# Phase4 camera and interaction — implementation, 9 October2026

Latest correction: viewport/safe-area changes trigger a new fit (rather than preserving the old distance); scripted rotations accumulate intended endpoints. Rear-facing traversal now tests the actual rear facade and raises the approach through the same conservative geometry while retaining horizontal heading. These fixes were inspected in production; rear Companies24 is clear. Earlier front-only description below is the first implementation history, not current rear capability. Arbitrary side occlusion is still not a general guarantee.

## Canonical selection

`world-store.travelFloors` resolves exact rank in the actual default/legacy/stress inventory and updates listing ID, tower, profile visibility and selected-floor camera mode together. Camera and drawer resolve that same ID. The old bug advanced only an approximate camera Y while preserving Northstar's selected ID. Closing a drawer now hides it without losing the selected floor; subsequent navigation reopens the corresponding profile. Reset clears selection/preview and restores overview.

## Gesture contract

- Overview: drag orbit; wheel zoom; tower/floor raycast selection focuses content.
- Focused: ordinary wheel traverses floors; Shift-wheel zoom; explicit Scroll:Floors/Zoom switch chooses ordinary-wheel behavior. Ctrl/Meta-wheel is treated as zoom when delivered to the canvas, not a universal OS/browser promise.
- Zoom buttons remain available. Floor arrows move exactly one rank and clamp to real inventory bounds.
- Canvas-focused ArrowUp/ArrowDown traverse. Escape first closes an open profile, then resets on a subsequent action. Inputs and drawer are not global keyboard/wheel interception targets.
- OrbitControls retains two-finger dolly/rotate, but genuine touch/pinch has not yet been tested on hardware.

Wheel line/page deltas normalize to pixels. A60px accumulator emits one floor, resets on direction reversal or180ms pause. Very long continuous high-resolution gestures still need real-trackpad testing. Frame-rate-independent exponential interpolation retains horizontal orbit during travel. Rapid scripted toolbar actions must accumulate from the previous intended destination, not an intermediate frame.

## Safe framing and occlusion

Existing tablet601–900px bottom drawer reused; no competing layout introduced. Resize/class/child insertion observation measures actual overlays. Perspective view offset moves the usable image center without displacing the real floor orbit pivot. Focus bounds are3.5×0.85×2.3 half extents around the real floor center, shared exploded-floor geometry is the indexing source.

Existing vegetation coordinates are exported into one deterministic source. Conservative canopy spheres and15 facade sightline samples choose the lowest clear rise from0.025,0.12,0.25,0.4,0.6,0.8. No vegetation deletion or abrupt fading. This checks front-facing canopy obstructions, not all trunks/props or arbitrary rear/side occluders. It is not a complete general-purpose occlusion manager.

## Verification

Store regressions cover1→12→1, bounds, rapid repetition, categories, drawer close/reopen, preview exit,24/14/14,50/20/20 and220 inventory. Projection-offset and canopy geometry tests ran. Current production rank12/profile and three bottom identity blocks were visually inspected. Final rapid-toolbar fix and complete input/angle/mobile acceptance remain pending. See phase-4-visual-qa.md; unit success is not browser acceptance.
