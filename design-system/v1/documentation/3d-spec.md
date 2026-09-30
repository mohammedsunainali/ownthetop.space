# OwnTheTop 3D Production Specification V1

## Coordinate / scale contract
- World units: metres.
- Keep individual world assets near sensible real-world scale ranges rather than arbitrary unitless scaling.
- Y-up in glTF delivery; account for Blender Z-up when importing/exporting.

## Mascot
Canonical editable source and GLB exist in Higgsfield 3D Jutsu project `d106d253-ecae-43de-933d-946c322d6c53`, revision 3. Git stores provenance registries under `3d/mascot/`; the `.blend`, `.glb` and canonical 3D render PNG bytes are remote artifacts rather than Git-tracked binaries.

Materials: Soft White body, Deep Navy visor, Primary/Sky/Light Blue skyline, Summit Gold crown peak, white/cream eye marks. Satin/soft-plastic response, metalness 0, moderate roughness, controlled highlights.

## Tower
OwnTheTop tower geometry is original. Architectural inspiration is limited to verticality, taper, setbacks, central dominance and spire. Do not copy the Burj mesh or silhouette literally.

Generated download-package files, not present as Git-tracked GLBs in this PR:
- `3d/towers/tower.glb`
- `3d/towers/tower-podium.glb`
- `3d/towers/tower-crown.glb`

## Environment
Generated download-package files, not present as Git-tracked GLBs in this PR:
- `3d/environment/helipad.glb`
- `3d/environment/cloud.glb`
- `3d/environment/tree.glb`
- `3d/environment/ownthetop-world.glb`
- aircraft family under `3d/aircraft/`
- signage family under `3d/signage/`

The composed world GLB in the downloadable build package is the geometry source for all three generated environment render states.

## Environment states
**Day:** atmospheric blue sky, pale horizon, white clouds, bright architecture/water, soft shadows.  
**Sunset:** warm gold/peach light, longer soft shadows, warm glass/water reflection.  
**Night:** deep navy, illuminated accents/signage/windows, darker water and aircraft-light accents.

## Export
- GLB: Khronos-compatible glTF binary; PBR-friendly material roles.
- Keep semantic object names when using Blender source.
- Avoid web-incompatible procedural shading when portable GLB appearance matters.
- Verify all GLBs parse before release.

## Uploaded Burj `.blend`
The user-supplied file is preserved as architectural source material. Its internal scene/object/material/camera/light inventory was **not inspected in the active runtime**, so this spec makes no scene-level claims about that file.
