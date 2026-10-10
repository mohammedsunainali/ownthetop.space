# Phase 2.3 before audit (local checkpoint `1bb38fa`)

The supplied OwnTheTop screenshots show an undersized V-wing logo/artwork, a green nose hiring badge concealed by the raised logo plaque, duplicated rank/value blocks crowding the Y seam, cramped height metric, oversized ungrouped controls, a tiny-world zoom extreme, and night mode with little local light hierarchy. These observations are from the provided frames, not inferred from source alone.

## Measured source geometry and layout

- Floor height 0.62, gap 0.10, pitch 0.72 world units; rank elevation is `FLOOR_BASE_Y + (floorCount - rank) * FLOOR_PITCH`. `getFloorFootprint` supplies the existing tapered/setback multiplier and is not to be changed for signage.
- Existing wing front width 1.31, side width 2.07, side center 1.27, clear glazing height `0.62 * 0.84 = 0.5208` units. Advertising height is `0.5208 * 0.76 = 0.395808` units.
- Side media uses 8% of physical side width at the center seam and 4% at its outer edge: nominal usable side width `2.07 * 0.88 = 1.8216` units, then scaled by that floor's footprint. Nominal seam dead zone is `2.07 * 0.08 = 0.1656` units before taper. Nose media width is `1.31 * 0.92 = 1.2052` units before taper.
- V-wing logo plaque currently measures `mediaHeight * 0.42 * contentScale`, bounded at 82% of wide-floor size. Nominal wide plaque is 0.16624 world units. The canvas logo art is contained inside a 256px plaque with 18% nominal padding on each edge; source-image transparent margins are not normalized.
- Wing media canvas width 1536px and height is computed from physical media aspect ratio. The content uses a 4.5% edge pad, 3.4% logo/text gap, 19% stats width, a name of 19% of texture height (min 15%), subtitle of 8.5% (min 6.8%), rank of 18%, and amount of 16%. The current left-wing layout places stats at its left, next to the central seam, making the screenshot collision credible.
- The nose hiring badge is drawn into the canvas at 32% of media height below center; the raised logo plaque is moved only 7% downward when hiring. The badge can be occluded by the plaque.
- CSS metric cards reserve a fixed 42px value column. The height value is one string (e.g. `1364 ft`), which wraps into the label visually. Controls are a single ungrouped flex strip (vertical layout in the active responsive rules).
- Overview destination uses target height `0.5 * tallestTowerHeight` in the normal 50-floor fixture and offset `(22,46,84) * tallestTowerHeight / getTowerHeight(50)` on desktop. `OrbitControls` permits 4–240 world-unit distance, explaining the tiny-world maximum zoom-out. Maximum polar angle is `pi/2.05`; camera/toolbar transitions and manual authority both modify the same OrbitControls camera/target through `CameraController`.
- The environment has a 23-unit lawn disk over a 65-unit water/background disk. The diameter ratio of the inner district to outer surface is 23:65, confirming the two-disc composition in the supplied overview.
- Night currently has ambient 0.42, hemisphere 0.45 and a directional light 0.85; there are no local plaza/street light pools in `BasicEnvironment`. Material emissive increases alone cannot create the requested nighttime depth.

## Reference behavior observed

- TopFloor recording, 16s: readable facade at mid distance and a compact profile alongside it; 40s: guided movement reaches the pavilion with the tower remaining the navigation focus. Principle: camera composition and text hierarchy, not a copy of its tower or UI.
- AI Traffic recording, 16s: a lower perspective makes road, trees and cars legible; 40s: traffic remains aligned to the street grid across a lateral camera move. Principle: use multiple spatial depths and grounded motion, not its city scale or assets.
- Token Town recording, 8s and 24s: warm local fixtures separate focal buildings, streets and people from a dark background; navigation retains a stable readable point of interest. Principle: small light hierarchy and controlled framing, not its shops, branding or effects.
- Apple Park supplied image: the entire circular edge is landscaped and visibly designed. Principle: finish OwnTheTop's perimeter without copying its architecture.

The public BLR AI base URL and AI Museum URL were inaccessible in the available web reader; the supplied frames remain usable references. No signed BLR AI URL was present in this task's text.
