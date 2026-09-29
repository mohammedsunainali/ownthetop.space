# OwnTheTop 3D Specification V1

Status: **implementation-ready specification**. Binary production assets are only READY when a real GLB/GLTF/BLEND artifact exists.

## World

OwnTheTop is a stylized architectural skyline. The hero tower dominates; supporting assets create scale without competing for attention.

Coordinate recommendation: Y-up, meters/world-units kept internally consistent. Keep authored model origins predictable and place reusable assets around their natural pivot.

## Tower architecture

Parametric modules:

```text
TowerBase
Podium
Core
WingA
WingB
WingC
FloorStack
Setback
Crown
Spire
Helipad
Rooftop
Billboard
Facade
WindowModule
```

Architectural direction: extreme verticality, tapering, repeated setbacks and a central spire, inspired by the supplied iconic-skyscraper reference but using original geometry and proportions.

## Procedural floor system

`Floor(level, listing)` is generated from data. Do not model hundreds of floors manually.

Recommended V1 world units:
- floor height: 0.9
- floor width: 12
- floor depth: 6
- floor separation: 0.12
- base height: 4
- setback cadence: every ~12 visible levels, with procedural adjustment for silhouette

Each floor renders world geometry plus DOM/HTML labels for readable name/rank/price data.

## Scaling to large counts

- 1–50 floors: full visible geometry
- 51–200: batch repeated façade geometry and simplify non-selected labels
- 201–500: LOD floor groups + label virtualization
- 500–1000+: clustered representation away from camera; selected/nearby floors retain detail

Use InstancedMesh for repeating slab/window modules. Avoid one React component per window/tree.

## Materials

### Glass
Cool blue, semi-reflective, moderate roughness, controlled transmission/opacity. V1 target opacity token: 0.72. Avoid mirror-like glass.

### Concrete
Off-white matte slabs with strong silhouette and minimal surface noise.

### Metal
Muted steel with restrained reflection.

### Summit / gold
Gold is rare and semantic: mascot summit, #1 highlight and special crown moments.

### Water
Low-cost reflective material. Prefer screen-space/simple environment reflection over expensive physical simulation.

## Camera

- default distance: 34
- min distance: 14
- max distance: 88
- prioritize cinematic orbit / focus transitions over free-fly camera
- selected floor can trigger a controlled camera focus
- reset returns to canonical hero framing

## Environment

Reusable family:
- `ott_tower_hero.glb`
- `ott_tower_companion_01.glb`
- `ott_tower_podium.glb`
- `ott_tower_crown.glb`
- `ott_helipad.glb`
- `ott_plane_01.glb`
- `ott_helicopter_01.glb`
- `ott_drone_01.glb`
- `ott_cloud_01.glb`
- `ott_tree_01.glb`
- `ott_car_01.glb`
- `ott_billboard_01.glb`
- `ott_rooftop_sign.glb`

These filenames are **naming contracts** until the binary files are actually produced.

## Aircraft

Plane, helicopter, drone and optional blimp/sky-banner assets use authored spline/Bezier/waypoint paths. Physics is not required.

States: idle, flying, turning, advertising, highlighted.

Keep aircraft as scale cues and playful world events, not gameplay objects.

## Advertising inventory

Visual specifications only for V1:
- Sky Banner
- Aircraft Banner
- Drone Ad
- Rooftop Billboard
- Tower LED
- Ground Billboard

Monetization engine is out of scope for the visual system.

## Day / Sunset / Night

WorldState controls:

```ts
type WorldState = 'day' | 'sunset' | 'night'
```

Tokens:

| Property | Day | Sunset | Night |
|---|---:|---:|---:|
| skyColor | #83CBFF | #F49A72 | #081529 |
| waterColor | #46B8EA | #C98787 | #0F4266 |
| ambientLight | 1.10 | 0.75 | 0.22 |
| directionalLight | 2.60 | 1.80 | 0.45 |
| windowIntensity | 0.10 | 0.80 | 2.20 |
| cloudBrightness | 1.00 | 0.86 | 0.35 |
| aircraftLightIntensity | 0.20 | 0.80 | 1.80 |
| signageBrightness | 0.60 | 1.00 | 1.60 |
| mascotHighlight | 1.00 | 1.15 | 1.30 |

Transitions interpolate; they do not hard-switch.

## World-time recommendation

V1 shared behavior can map a resolved world time to:
- day: 08:00–16:59
- sunset: 17:00–18:29
- night: 18:30–06:59

This is a **recommended implementation default**, not a permanent product rule.

## Mascot in 3D

The mascot uses separable groups:
- body
- visor
- eye expression
- left/right appendages
- feet
- blue skyline peak group
- central gold summit

This supports idle bounce, wave, fly-up, celebration, outbid reaction and #1 victory without changing the character model.

## Performance

Required:
- instancing
- LOD
- Meshopt/Draco where appropriate
- KTX2/compressed textures where used
- texture atlases
- capped DPR
- lazy loading
- frustum culling
- pooled world events
- reusable materials and geometries

Targets should be device-tiered. Mobile receives fewer environmental instances, simpler lighting and lower DPR.

## DOM + 3D boundary

Three.js/R3F owns geometry, lights, world materials and camera.

DOM owns readable company/entity names, rank, price, profile drawers, buttons, forms and accessibility semantics. Drei `Html` may bridge selected labels, but do not turn every window/floor into a DOM node.

## Supplied Blender source

`BUrj khalifa.blend` was supplied as an architectural reference. **Internal scene object/material/camera/light details are not stated as fact until inspected in a Blender-capable runtime.** Do not hallucinate its object hierarchy.
