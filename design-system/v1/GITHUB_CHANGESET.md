# GitHub Changeset — OwnTheTop Design System V1

**Status:** APPROVED FOR FINAL AUDIT + MERGE  
**Target repository:** `mohammedsunainali/ownthetop.space`  
**Branch:** `design-system-v1`  
**PR:** #2 — squash merge to `main` after successful release checks.

## Tracked in this PR
- Canonical design-system documentation: README, design specification, 3D specification, source audit, logo/mascot guidelines, usage and repository placement.
- Genuine editable SVG production system: mascot, ten flat pose derivatives, logo lockups, outlined wordmark, app-icon/favicon/social/sticker/tower-sign vectors.
- Semantic token package: JSON, CSS and TypeScript.
- Figma handoff metadata and release-audit observation.
- Responsive documentation website source and its required vector assets.
- Canonical 3D mascot provenance and exact remote render registry.
- One Git-tracked favicon PNG: `png/icons/ownthetop-favicon-16.png`.

## Canonical repository placement
`design-system/v1/` is the sole canonical Design System V1 repository package. The old duplicate top-level `ownthetop-design-system-v1/` package is not present in the final branch tree.

The `documentation/` subdirectory intentionally mirrors selected canonical root documents for packaged handoff. Mirrored copies must remain content-synchronized.

## Not Git-tracked binaries
Locally generated PNG and GLB families exist in the downloadable build package but are not committed in bulk in this PR. Canonical mascot `.blend`, `.glb` and 3D render PNGs remain remote Higgsfield artifacts indexed under `3d/mascot/`.

## Merge policy
After final CI passes, mark PR #2 ready for review and squash-merge only PR #2 into `main` with commit title `OwnTheTop Design System V1`. No unrelated branch or PR is included.
