# GitHub Changeset — OwnTheTop Design System V1

**Status:** APPROVED FOR PUSH  
**Target repository:** `mohammedsunainali/ownthetop.space`  
**Branch:** `design-system-v1`  
**PR:** #2 — update only; do not merge automatically.

## Tracked in this push
- Canonical design-system documentation: README, design specification, 3D specification, source audit, logo/mascot guidelines, usage and repository placement.
- Genuine editable SVG production system: mascot, ten flat pose derivatives, logo lockups, outlined wordmark, app-icon/favicon/social/sticker/tower-sign vectors.
- Semantic token package: JSON, CSS and TypeScript.
- Figma handoff metadata for the verified 18-page system.
- Responsive documentation website source and its required vector assets.
- Canonical 3D mascot provenance and exact remote render registry.
- GitHub transfer note documenting binary-transfer boundaries.

## Intentionally removed/replaced
- Remove the old duplicate top-level `ownthetop-design-system-v1/` package from this branch so `design-system/v1/` is the sole canonical repository location.
- Replace stale docs that claimed no GitHub push or implied unsupported Burj scene inspection.

## Not falsely committed
Locally generated PNG and GLB families exist in the downloadable build package, but the current GitHub connector cannot directly ingest mounted binary files in bulk. Those files remain downloadable build artifacts and must be copied with a normal Git client if binary-in-repository delivery is required.

The remote canonical mascot `.blend`, `.glb` and canonical 3D render PNGs remain indexed in `3d/mascot/`; their bytes are not renamed or replaced by screenshots.

## Merge policy
This push updates the existing draft PR #2. It does **not** merge the PR, enable auto-merge, or modify `main`.
