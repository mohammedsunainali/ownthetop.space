# OwnTheTop — Final Source Audit

Date: 2026-09-30

## Source hierarchy
1. Approved OwnTheTop Skyline / Summit mascot
2. Approved OwnTheTop logo reference
3. OwnTheTop product decisions
4. OwnTheTop 3D world / Burj-inspired references
5. Clay design-system structure
6. Clay visual references
7. TopFloor product-interaction references
8. General design knowledge

## VERIFIED
- Canonical 3D mascot project exists in Higgsfield 3D Jutsu at revision 3; verified Blender and GLB artifact sizes are non-zero.
- Canonical mascot scene was queried directly: body, lower body, visor, eyes, five skyline peaks, gold summit, two side appendages and two feet are semantic scene objects.
- 3D mascot turnarounds, ten pose renders, 512/1024/2048 primary renders and dark/white/monochrome renders were generated from that same project.
- SVG family contains genuine vector markup with no embedded raster images.
- Wordmark SVG is outlined paths rather than live font text.
- Local tower/environment/aircraft/signage GLBs were generated and verified in the build environment.
- Day, Sunset and Night renders use the same generated world geometry and camera framing.
- Figma handoff records 18 pages, reusable component/variant sets, variable collections and text styles.
- Documentation website is real responsive HTML/CSS/JS.

## PROPOSED
- Future production refinement can increase GLB detail/material sophistication without changing the locked silhouette/token contracts.
- 4096px mascot render is optional and not included in V1.

## INFERRED
- Burj-inspired design principles used here are verticality, taper, setbacks, central dominance and spire; they are treated as architectural inspiration, not copied geometry.

## REFERENCE_ONLY
- User-supplied mascot/logo boards.
- Clay screenshots and Clay design-system text as structural reference.
- TopFloor screenshots as interaction/mechanic reference.
- Failed earlier visual output as architecture/documentation reference only.

## SOURCE_REQUIRED / transfer-limited
- The canonical mascot Blender/GLB and canonical 3D mascot PNG render family exist remotely, but their bytes cannot be mirrored into this Git tree through the active connector. Exact provenance is stored in `3d/mascot/`.
- Locally generated PNG/GLB package binaries are available in the downloadable build ZIPs; bulk transfer into Git is blocked by the connector's mounted-binary limitation.
- The uploaded Burj `.blend` internal object/material/camera/light inventory remains unverified in this runtime. It is preserved as source material; no internal scene claims are made.

## GitHub status
The user explicitly approved the push. Branch `design-system-v1` / PR #2 is the target. The PR must remain unmerged unless separately approved.
