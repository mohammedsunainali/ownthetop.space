# OwnTheTop.space

**Claim your space. Own the top.**

OwnTheTop is a live 3D competitive skyline where companies, products, and people compete for floors. Every listing owns exactly one floor; cumulative payment determines rank and therefore physical height within its tower.

## Phase 2 preview

The Phase 1 domain/ranking foundation is preserved. Phase 2 adds the canonical Design System V1 runtime, a richer procedural tower/world, day/sunset/night, responsive controls, and functional 2D WebGL fallback. The flow remains:

```text
deterministic mock entities → pure ranking engine → world data → procedural 3D skyline
```

The scene includes 20 company floors, 10 product floors, and 10 people floors. Payments, authentication, persistence, realtime updates, analytics, and production infrastructure remain out of scope. The approved 3D mascot GLB is not locally available; the app uses the canonical flat SVG and an empty 3D integration slot.

## Stack

- Next.js App Router, React 19, strict TypeScript
- Tailwind CSS
- Three.js, React Three Fiber 9, Drei
- Zustand for client interaction state
- Vitest and Testing Library

## Local setup

Requires Node.js 22+ and pnpm 9+.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
Append `?fallback2d` to the URL to exercise the functional ranking fallback without disabling WebGL at the system level.

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit --prod
```

## Architecture principles

- Domain and ranking logic are framework-independent.
- Ranking is scoped per tower using `totalPaidMinor DESC, claimedAt ASC`.
- Money is stored as integer minor units.
- Rendering consumes ranked world data; it never determines authoritative rank.
- Canonical CSS and TypeScript values live under `design-system/v1/tokens/`; runtime code imports those values rather than defining a new palette.
- The tower remains one reusable, data-driven renderer. Decorative podium, crown and spire do not represent paid floors.
- One reusable tower renderer consumes three tower configurations.
- Rank `#1` maps to the physically highest claimed floor.
- Listing count controls tower floor count; payment never creates floors.

See [asset preflight](docs/phase-2-assets.md) and [performance review](docs/phase-2-performance.md) for Phase 2 limitations and provenance.

See [docs/architecture.md](docs/architecture.md), [docs/roadmap.md](docs/roadmap.md), [docs/repository-audit.md](docs/repository-audit.md), and [docs/reference-matrix.md](docs/reference-matrix.md).
