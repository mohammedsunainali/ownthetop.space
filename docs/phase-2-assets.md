# Phase 2 asset preflight

The Git-tracked `design-system/v1` is the canonical visual source. The only runtime mirrors are `public/brand/ownthetop-logo-primary.svg` and `public/brand/ownthetop-mascot-flat.svg`; they are byte-identical to their canonical files. No GLB is copied into `public/` or used by the application. All added 3D geometry is original procedural code.

## Canonical mascot

**MASCOT GLB — SOURCE_REQUIRED.** `design-system/v1/3d/mascot/REMOTE-SOURCE.json` and the asset manifest describe an approved remote GLB, but the binary was not physically available in Git or the supplied local packages. `MascotSlot` is the intentional no-model integration boundary. The approved flat SVG is used in the hero and profile empty state. No substitute 3D mascot was made.

## Local binary inventory

The following GLBs were found in `/Users/mohammedsunainali/Downloads/ownthetop-3d-assets-v1/3d/` and duplicated in the `ownthetop-design-system-v1 4/3d/` handoff. They parsed as GLB v2, contained no external texture references, and were not copied into production. The local handoff docs describe generated OwnTheTop assets; the procedural implementation avoids static meshes that could break dynamic floor counts or add unneeded loaders.

| File | Size | Triangles (approx.) | Status / reason not used |
|---|---:|---:|---|
| aircraft/drone.glb | 17,216 B | 880 | Available; original procedural drone keeps materials token-driven |
| aircraft/helicopter.glb | 11,300 B | 424 | Available; original procedural helicopter used |
| aircraft/plane.glb | 5,368 B | 152 | Available; original procedural planes used |
| environment/cloud.glb | 14,492 B | 1,280 | Available; instanced procedural clouds used |
| environment/helipad.glb | 10,960 B | 548 | Available; procedural rooftop helipad preserves tower scale |
| environment/ownthetop-world.glb | 140,524 B | 11,504 | Available; static world not used in data-driven scene |
| environment/tree.glb | 13,980 B | 768 | Available; instanced procedural trees used |
| signage/billboard.glb | 2,440 B | 36 | Available; procedural billboard used |
| signage/rooftop-sign.glb | 3,176 B | 48 | Available; decorative signage deferred |
| towers/tower-crown.glb | 5,344 B | 152 | Available; procedural crown remains height-aware |
| towers/tower-podium.glb | 1,936 B | 24 | Available; procedural podium used |
| towers/tower.glb | 8,040 B | 212 | Available; static tower would violate data-driven architecture |

The supplied `BUrj khalifa.blend` exists (about 46 MB) and was not imported, copied, exported, or used as production geometry. Blender was unavailable for read-only mesh inspection. It remains principle-only reference material. Archive contents were listed and matched to the local handoff folders; duplicates did not override Git-tracked canonical files.

## Production asset ledger

| Name | Source / provenance | Destination | Size / format | Optimization | Consumer |
|---|---|---|---|---|---|
| Primary logo | `design-system/v1/svg/logo/ownthetop-logo-primary.svg`, approved V1 | `public/brand/ownthetop-logo-primary.svg` | 4,029 B SVG | None; byte-identical | Header, in-world billboard, rooftop signs |
| Flat mascot | `design-system/v1/svg/mascot/ownthetop-mascot-flat.svg`, approved V1 | `public/brand/ownthetop-mascot-flat.svg` | 1,774 B SVG | None; byte-identical | Hero, empty profile |

No remote signed URLs, third-party textures, downloaded models, or unlicensed binaries are used at runtime.
