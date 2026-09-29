# Source Audit — OwnTheTop Design System V1

This file separates supplied facts from translation decisions, proposals and technical limitations.

## 1. OwnTheTop supplied / approved sources

### Approved Skyline / Summit mascot — SOURCE OF TRUTH

The approved mascot direction supplied in the conversation establishes:
- rounded light body
- dark navy face / visor
- simple expressive eyes
- blue architectural skyline peaks
- one central gold/yellow highest summit
- rounded blue side appendages
- small feet
- friendly floating character
- soft premium 3D treatment

**Status:** VERIFIED FROM SUPPLIED VISUAL SOURCE.

The mascot concept is locked. The design system does not return to rocket/eagle/falcon directions.

### Product mechanic

Supplied product decisions establish:

`PAY → RANK → FLOOR → HEIGHT → VISIBILITY`

One paid listing equals one floor. Cumulative amount determines ranking position; ranking position determines visible altitude.

**Status:** VERIFIED FROM USER-SUPPLIED PRODUCT DECISIONS.

### TopFloor screenshots

The supplied screenshots visibly support using the following as interaction/product-design inspiration:
- large central 3D tower/world
- blue-sky atmosphere
- floating controls
- stacked floors with rank and price
- profile side drawer
- live metrics
- environmental controls
- ruler/height cues
- aircraft and advertising banners
- rooftop / helipad cues
- playful environmental details

The package does **not** copy TopFloor's fox, logo, exact tower, exact CSS, source code, characters, copy or artwork.

**Status:** VERIFIED VISUAL OBSERVATION FROM SUPPLIED SCREENSHOTS.

### Burj Khalifa `.blend`

Supplied file: `BUrj khalifa.blend`.

It is retained as an architectural reference for verticality, taper, setbacks, skyline dominance and spire logic.

**Technical limitation:** the current artifact runtime did not provide a working Blender/container execution path during this build. Therefore the internal object names, materials, scene hierarchy, lights, cameras and textures were **not inspected and are not claimed as facts**.

> The uploaded Blender model is available as an architectural reference, but internal scene inspection is unavailable in this environment.

**Status:** SOURCE AVAILABLE / INTERNAL STRUCTURE UNKNOWN.

## 2. Clay reference — structure, not identity

The supplied Clay screenshots and `DESIGN-clay.md` support these structural observations:
- warm cream canvas
- strong editorial hierarchy
- large 3D illustration artifacts
- saturated feature-card rhythm
- 4px base spacing logic
- 96px major section rhythm
- 12 / 16 / 24px radius progression
- 12-column editorial layout
- restrained interface chrome
- product UI fragments inside feature cards
- warm/light footer treatment
- responsive 3 → 2 → 1 column collapse pattern

OwnTheTop translates those **system roles** into its own navy/blue/gold identity, Skyline/Summit mascot, ranking/floor/claim UI and architectural 3D world.

The package does not reproduce Clay's logo, licensed display font, product UI, copy, mascots or proprietary 3D assets.

**Status:** VERIFIED FROM SUPPLIED CLAY MATERIALS; TRANSLATED, NOT COPIED.

## 3. Proposed / recommended decisions in V1

These are implementation-ready design proposals derived from the approved direction, not pre-existing product facts:
- Instrument Sans as display family
- Geist as UI/body family
- Geist Mono as metric/data family
- exact shadow values
- exact motion timings: 80 / 160 / 240 / 420 / 720ms
- exact 3D world-unit values
- specific Day/Sunset/Night light intensity values
- recommended V1 local-time thresholds
- original modular tower anatomy and procedural floor dimensions
- specific Figma component naming

**Status:** PROPOSED / RECOMMENDED V1.

## 4. Inferences

### Burj-inspired architecture

Strong inference from the supplied architectural references: the OwnTheTop landmark should communicate height through a tapered central silhouette, repeated setbacks and a strong crown/spire rather than through a literal rectangular office block.

**Status:** STRONG INFERENCE / ORIGINAL IMPLEMENTATION REQUIRED.

### DOM + 3D split

The request explicitly prefers 3D for geometry/world and HTML/UI for legible product data. V1 formalizes this as a production contract: rank/name/price/forms/drawers remain semantic DOM wherever possible, while R3F owns world geometry, lights, materials and camera.

**Status:** SOURCE-SUPPORTED IMPLEMENTATION INTERPRETATION.

## 5. Mobbin

The Mobbin connector was requested as a reference source, but the connected MCP account reported that Mobbin MCP requires a paid plan. No Mobbin screen was therefore used as evidence in this build.

**Status:** UNAVAILABLE CONNECTOR SOURCE; NOT USED.

## 6. Generated artifacts

### READY
- editable Figma file and page structure
- Figma variables and text styles
- editable mascot pose component set
- logo components
- Button, Website Input, Badge, Feature Card, Ranking Row, Floor Card, Claim Form and Listing Profile components
- product UI documentation
- 3D system documentation boards
- responsive boards
- motion boards
- repository source documentation
- JSON/CSS/TypeScript token contracts
- genuine SVG brand assets created from vector primitives
- static documentation website source

### PROPOSED
- final production tower geometry
- final production mascot GLB topology/rig
- final aircraft/environment GLBs
- exact production motion choreography beyond token timing

### SOURCE REQUIRED / NOT GENERATED
- production GLB/GLTF binaries
- production `.blend` revisions
- production audio files
- licensed HDRI/environment maps
- final sound mix

## 7. Anti-hallucination checks

The package does not invent:
- customer logos
- customer testimonials
- real traffic metrics
- real sales numbers
- unsupported future product features
- production 3D files that do not exist
- internal Blender scene data that was not inspected

Any example entity data in documentation is illustrative and must not be presented as live product data.
