# OwnTheTop Design System V1

This package is the visual + implementation source of truth for OwnTheTop.space.

## Start here

1. `design.md` — brand, UI, product behavior and source analysis.
2. `3d-spec.md` — tower/world architecture and performance contract.
3. `tokens/tokens.json` / `tokens/tokens.css` / `tokens/ownthetop_tokens.ts` — implementation values.
4. `website/index.html` — long-form visual documentation.
5. `asset-map.json` and `asset-manifest.json` — canonical asset names, locations and status.
6. `repository-placement.md` — integration notes for the existing Next.js/R3F project.

## Repository truth boundary

- Git-tracked production binaries are limited to the files physically present in this tree; V1 currently includes the 16px favicon PNG plus the editable SVG/source/documentation families.
- Canonical mascot `.blend`, `.glb` and 3D render PNGs are remote Higgsfield artifacts indexed in `3d/mascot/`.
- Generated world GLBs and the broader PNG export family are download-package-only in V1 and are not represented as Git-tracked binaries.
- The Figma link is tracked in `figma/figma-handoff.json`; the Figma visual system was explicitly pre-approved for this release and was not modified during the GitHub release audit.

## Important

- One paid listing = one floor.
- Cumulative paid amount determines ranking.
- Listing count determines tower height.
- Demo metrics in documentation are explicitly non-production.
- The uploaded Burj reference is preserved as architectural source material; its internal scene hierarchy was not inspected in the active runtime and is not claimed here.
- Production audio is specified but not fabricated; no pretend sound assets are included.
- Fonts are referenced by family name only; no font files are redistributed.
