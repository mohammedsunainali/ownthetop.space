# Phase 1 architecture

## Dependency direction

```text
domain types
    ↓
pure ranking engine
    ↓
deterministic ranked mock data
    ↓
world configuration and interaction state
    ↓
React Three Fiber presentation
```

`src/lib/ranking/rank-listings.ts` imports domain types only. It has no React, Three.js, Zustand, browser, or renderer dependency. The renderer receives ranked listings and maps their derived rank onto a physical floor coordinate.

## Domain rules

- One listing equals one floor.
- Payment is cumulative ranking power and is stored as integer USD minor units.
- Ranking is independent per tower.
- Higher cumulative payment wins; earlier claim time resolves equal totals.
- The function returns new objects and does not mutate the input.
- Floor count is the listing count. Payment does not alter that count.

## World composition

One `Tower` component consumes a `Tower` domain record, a listing collection, and a visual configuration. It composes a podium, central core, three conceptual wings, floor stack, crown, and spire. All three tower types use this same implementation.

`getFloorY` converts rank to physical position. The calculation reverses rank within a fixed floor count, so rank `#1` is always highest. Each listing floor is a small three-wing group rather than a facade/window component graph.

Camera modes are `overview`, `companiesTower`, `productsTower`, `peopleTower`, and `selectedFloor`. Zustand stores only interaction/world state. Canonical listings and ranking do not live in the store.

## Performance posture

- WebGL DPR is capped at 1.75.
- There are no textures, models, HDRIs, postprocessing passes, or per-window components.
- Only three small DOM scene labels are mounted, one for each top floor.
- The camera controller owns the single `useFrame` callback.
- No per-frame React state updates occur.
- Geometry is procedural and the Phase 1 scene remains intentionally small (40 floors / 120 simple wing meshes).
- Repeated geometry could move to instancing in a later visual phase if floor volume grows materially; at current counts that optimization would add complexity without meaningful benefit.

## Error and accessibility foundations

The canvas provides a WebGL fallback. Full listing detail is presented in a normal DOM profile drawer, while scene labels remain deliberately sparse. Buttons and form controls use native semantics and labels.

## Intentional limits

The claim form is demonstrative. It does not submit, redirect, collect payment, or persist data. Camera movement is a direct damped transition rather than a cinematic sequence. Visuals are structural placeholders, not a literal or imported real-world tower.
