# OwnTheTop 3D Asset Package

This directory defines the production asset contract for the OwnTheTop world.

## Status

No binary model in this directory should be treated as complete until a real `.glb`, `.gltf` or `.blend` file is committed.

### PROPOSED — geometry specification exists

```text
mascot/mascot.glb
tower/ott_tower_hero.glb
tower/ott_tower_podium.glb
tower/ott_tower_crown.glb
tower/ott_helipad.glb
```

### SOURCE REQUIRED — naming and art direction exist, production binary does not

```text
aircraft/ott_plane_01.glb
aircraft/ott_helicopter_01.glb
aircraft/ott_drone_01.glb
environment/ott_cloud_01.glb
environment/ott_tree_01.glb
environment/ott_car_01.glb
advertising/ott_billboard_01.glb
advertising/ott_rooftop_sign.glb
```

## Model conventions

- Y-up
- mesh names use `ott_<family>_<name>_<index>`
- material names use `mat_<role>`
- pivots placed for intended animation/orbit behavior
- repeated geometry authored for instancing
- static meshes use optimized transforms before export
- texture dimensions should be powers of two where compression benefits
- KTX2/Meshopt/Draco considered per asset; never compress blindly if it harms startup time

## Mascot hierarchy recommendation

```text
OTT_Mascot
├── Body
├── Visor
├── Eyes
├── Arm_L
├── Arm_R
├── Foot_L
├── Foot_R
├── Skyline_Blue
└── Summit_Gold
```

Keep expressions separate enough to support default, happy, surprised, outbid and victory states without swapping the entire model.

## Tower hierarchy recommendation

```text
OTT_Tower
├── Base
├── Podium
├── Core
├── FloorStack_LOD0
├── FloorStack_LOD1
├── Crown
├── Spire
├── Helipad
├── RooftopSign
└── BillboardSockets
```

Floor listing data is procedural and should not be baked into the hero tower mesh.

## Performance contract

- instance slabs/windows/trees where practical
- use LOD for distant floor stacks and companion buildings
- reuse materials and atlases
- cap DPR by device tier
- avoid transparent geometry unless it materially improves the silhouette
- frustum-cull static world props
- pool aircraft and world-event objects
- virtualize DOM labels for large floor counts

See `../3d-spec.md` for world-state values, camera limits and procedural floor guidance.

## Supplied `.blend`

The uploaded `BUrj khalifa.blend` remains an architectural reference source. Its internal object/material hierarchy is **not documented as fact** because Blender scene inspection was unavailable in the runtime used for this package.
