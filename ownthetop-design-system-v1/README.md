# OwnTheTop Design System V1

**Claim your space. Own the top.**

This directory is the implementation and documentation package for the OwnTheTop visual system.

Figma: https://www.figma.com/design/ye3qSatvvE02DXDr1pAr3d

## What OwnTheTop is

A live 3D competitive skyline where paid cumulative amount determines rank, rank determines floor position, and altitude creates visibility.

`PAY → RANK → FLOOR → HEIGHT → VISIBILITY`

One paid listing equals one floor.

## Source of truth

1. Approved Skyline / Summit mascot
2. Final OwnTheTop product decisions
3. OwnTheTop 3D/tower architecture
4. Supplied architectural `.blend` reference where inspectable
5. Clay system structure and page rhythm
6. Clay visual examples
7. Proposed recommendations

Clay is used as a **system-architecture reference**, not a brand template.

## Package

```text
ownthetop-design-system-v1/
├── README.md
├── design.md
├── 3d-spec.md
├── repository-placement.md
├── source-audit.md
├── tokens.json
├── tokens.css
├── ownthetop_tokens.ts
├── asset-map.json
├── website/
│   ├── index.html
│   └── styles.css
├── assets/
│   └── svg/
└── 3d/
    └── README.md
```

## Typography

- Display: Instrument Sans
- UI/body: Geist
- Metrics: Geist Mono

The package does not redistribute font binaries.

## Brand

The Skyline / Summit mascot is locked. Preserve the rounded light body, navy visor, blue skyline peaks and central gold summit.

Gold means **the top**. Blue means **the world / climb**. Navy means **authority / rank**.

## Design tokens

- `tokens.json` — canonical structured token map
- `tokens.css` — web CSS custom properties
- `ownthetop_tokens.ts` — TypeScript constants for application code and R3F world state

Figma contains matching local variable collections:
- `OTT / Primitives`
- `OTT / Semantic Colors` with Light/Dark modes
- `OTT / Metrics`
- `OTT / World State` with Day/Sunset/Night modes

## Figma structure

```text
01 Cover
02 Brand
03 Mascot
04 Logo
05 Colors
06 Typography
07 Components
08 Product UI
09 3D World
10 Responsive
11 Motion
12 Documentation
13 Assets
```

The Figma file includes 86 local variables, 15 text styles, mascot pose variants, logo components, buttons, inputs, badges, feature cards, ranking rows, floor cards, a claim form and listing-profile components.

## Web implementation

The documentation website in `website/` is a lightweight static reference implementation. It intentionally avoids framework dependencies so engineering can inspect tokens and structure directly.

For the production OwnTheTop app, map the same tokens into Next.js/React and React Three Fiber rather than importing the documentation page wholesale.

## 3D implementation

See `3d-spec.md`. Binary GLB/GLTF files are not claimed unless actually produced. Naming entries in the spec are contracts, not fake assets.

Recommended production stack remains Next.js, React, TypeScript, Three.js, React Three Fiber, Drei, Zustand, Supabase, Razorpay and Vercel.

## Figma mapping

Recommended pages:
- Brand ↔ `design.md` brand/mascot/logo sections
- Colors/Typography ↔ `tokens.json`
- Components ↔ production UI primitives
- Product UI ↔ ranking/floor/claim/profile code
- 3D World ↔ `3d-spec.md`
- Motion ↔ token durations + product animation state machine
- Assets ↔ `asset-map.json`

## Status labels

- **READY** — real artifact exists
- **PROPOSED** — implementation-ready design/specification
- **SOURCE REQUIRED** — production source has not been generated or inspected

## Important

No fake customer metrics, customer logos, testimonials, 3D binaries or sound files are included. Demo content must always be labeled demo data.
