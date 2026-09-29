# OwnTheTop.space

**Claim your space. Own the top.**

OwnTheTop is a live 3D competitive skyline where companies, products, and people compete for floors. Every listing owns exactly one floor; cumulative payment determines rank and therefore physical height within its tower.

## Phase 1

This repository currently contains the Foundation + Architecture milestone. It proves the flow:

```text
deterministic mock entities → pure ranking engine → world data → procedural 3D skyline
```

The scene includes 20 company floors, 10 product floors, and 10 people floors. Payments, authentication, persistence, realtime updates, analytics, and production asset polish are intentionally out of scope.

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

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Architecture principles

- Domain and ranking logic are framework-independent.
- Ranking is scoped per tower using `totalPaidMinor DESC, claimedAt ASC`.
- Money is stored as integer minor units.
- Rendering consumes ranked world data; it never determines authoritative rank.
- One reusable tower renderer consumes three tower configurations.
- Rank `#1` maps to the physically highest claimed floor.
- Listing count controls tower floor count; payment never creates floors.

See [docs/architecture.md](docs/architecture.md), [docs/roadmap.md](docs/roadmap.md), [docs/repository-audit.md](docs/repository-audit.md), and [docs/reference-matrix.md](docs/reference-matrix.md).
