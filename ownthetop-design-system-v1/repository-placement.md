# Repository Placement — OwnTheTop Design System V1

This package is deliberately isolated under `ownthetop-design-system-v1/` so it can be reviewed before production code adopts it.

## Canonical locations

```text
ownthetop.space/
├── ownthetop-design-system-v1/       # authoritative design package
│   ├── design.md
│   ├── 3d-spec.md
│   ├── tokens.json
│   ├── tokens.css
│   ├── ownthetop_tokens.ts
│   ├── website/
│   └── assets/
│
├── public/
│   └── brand/                        # copy approved production assets here
│
└── src/
    ├── components/                   # map approved Figma components here
    ├── styles/                       # consume CSS token aliases here
    ├── lib/                          # ranking/payment/world-state contracts
    └── world/                        # R3F tower/environment implementation
```

## Adoption order

1. Review and approve `design.md` and Figma.
2. Adopt `tokens.json` / `tokens.css` without changing semantic meanings.
3. Implement DOM primitives: Button, Input, Badge, RankingRow, FloorCard, ClaimForm, ListingProfile.
4. Implement world-state tokens and R3F environment interpolation.
5. Implement procedural tower/floor system from `3d-spec.md`.
6. Move only approved READY assets into `public/`.
7. Add Code Connect mappings once production component paths stabilize.

## Suggested production mappings

| Design-system asset | Suggested production destination |
|---|---|
| `tokens.css` | `src/styles/ownthetop-tokens.css` |
| `ownthetop_tokens.ts` | `src/lib/design-tokens.ts` |
| Logo / mascot SVG | `public/brand/` |
| UI icons | `src/components/icons/` or `public/icons/` |
| Button | `src/components/ui/Button.tsx` |
| Input/Website | `src/components/claim/WebsiteInput.tsx` |
| Badge | `src/components/ui/Badge.tsx` |
| Ranking/Row | `src/components/ranking/RankingRow.tsx` |
| Floor/Card | `src/components/floor/FloorCard.tsx` |
| Claim/Form | `src/components/claim/ClaimForm.tsx` |
| Listing/Profile | `src/components/listing/ListingProfile.tsx` |
| World state | `src/world/environment/worldState.ts` |
| Tower generator | `src/world/tower/` |

## Source-of-truth rule

Do not fork token values independently inside components. If production requirements force a change, update the design token and Figma variable together, then propagate the new value.

## 3D binary assets

The `3d/` folder contains specifications and naming contracts until actual GLB/GLTF files are produced. A filename mentioned in documentation is **not** evidence that the binary exists.

When a production binary is created, place it under a matching subdirectory and update `asset-map.json` from `PROPOSED` / `SOURCE_REQUIRED` to `READY`.

## Figma

Canonical editable file:

https://www.figma.com/design/ye3qSatvvE02DXDr1pAr3d

Use Figma for visual experimentation and review; use this repository package as the code-facing implementation contract.
