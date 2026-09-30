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
- Canonical mascot scene was previously queried directly: body, lower body, visor, eyes, five skyline peaks, gold summit, two side appendages and two feet are semantic scene objects.
- 3D mascot turnarounds, ten pose renders, 512/1024/2048 primary renders and dark/white/monochrome renders were generated from that same project.
- SVG family contains genuine vector markup with no embedded raster-image elements in the PR diff.
- Wordmark SVG is outlined paths rather than live font text.
- Local tower/environment/aircraft/signage GLBs were generated and verified in the build environment; those world binaries are download-package-only, not Git-tracked in this PR.
- Day, Sunset and Night renders use the same generated world geometry and camera framing in the build package.
- Documentation website is real responsive HTML/CSS/JS.
- Git-tracked `png/icons/ownthetop-favicon-16.png` is a valid 16×16 RGBA PNG with non-zero bytes.
- The Figma file link is accessible. The visual system is explicitly pre-approved by the user for this release.

## FIGMA RELEASE-AUDIT OBSERVATION
The handoff records an intended 18-page system. During this final read-only GitHub release audit, the Figma connector exposed one top-level page: `01 — COVER`. Because the user explicitly pre-approved the Figma system and prohibited Figma changes in this task, the audit records this observation without modifying the Figma file or claiming a fresh 18-page verification.

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
- The canonical mascot Blender/GLB and canonical 3D mascot PNG render family exist remotely, but their bytes are not mirrored into this Git tree. Exact provenance is stored in `3d/mascot/`.
- Locally generated broader PNG/GLB package binaries are available in the downloadable build ZIPs and are not Git-tracked in bulk.
- The uploaded Burj `.blend` internal object/material/camera/light inventory remains unverified in this runtime. It is preserved as source material; no internal scene claims are made.

## GitHub release status
The user explicitly approved final audit + merge of PR #2. The PR may be marked ready and squash-merged to `main` only after the latest branch CI passes and no new blocker is introduced.
