# OwnTheTop.space

**Claim your space. Own the top.**

OwnTheTop is an interactive 3D skyline demo for companies, products and people. Synthetic listings occupy one floor each; mock cumulative amounts determine rank and physical height within each tower. Real payments, reservations and paid ownership are not operational.

## Phase 4.5 frontend release

- Three towers with 24 company, 14 product and 14 people synthetic floors.
- Softer structural corners, greener procedural landscaping, varied miniature architecture, refined vehicles/people, and day/sunset/night lighting.
- Compact navy navigation dock and matching statistics rail; responsive controls, floor travel, profile sharing and readable close inspection.
- Approved 3D mascot with contextual, automatically dismissed speech bubbles; separate demo-only Crown showroom.
- Create Your Floor → 3D preview → `/checkout` summary, with a validated temporary draft kept in the same browser tab for up to 30 minutes, including refresh.
- Accessible 2D ranking list and WebGL fallback.

Checkout is a developer-ready placeholder. No payment provider, card form, reservation, transaction or persistent paid claim exists. Missing/expired drafts show a recovery link. See [checkout integration boundary](docs/phase-4.5-final-ux-checkout-handoff.md).

```text
deterministic mock entities → pure ranking engine → world data → shared/instanced 3D skyline
```

## Stack

- Next.js App Router, React 19, strict TypeScript
- Tailwind CSS
- Three.js, React Three Fiber 9, Drei
- Zustand for client interaction state
- Vitest and Testing Library

## Local setup

Use Node.js 22 and pnpm 9.15.4 to match CI (locally verified Node 22.23.1).

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
Append `?view=2d` to exercise the ranking fallback. The navigation dock also exposes “2D list”.

Production preview:

```bash
pnpm build
pnpm start --port 3004
```

Open [http://127.0.0.1:3004](http://127.0.0.1:3004). Development defaults to port 3000; `pnpm dev --port 3004` selects another port.

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit --prod
git diff --check
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

## Remaining production integrations

Authentication, server-authoritative pricing/rank/availability, secure payment sessions, verified idempotent webhooks, reconciliation, persistence and realtime paid claims remain future backend work. Never trust a frontend rank estimate or redirect as payment confirmation.

Physical-device performance, real cold-network initialization and first-render long tasks remain readiness gates. Narrow-phone 3D subtitles are too small in overview; use Read & inspect floor or the 2D list. Viewport QA and warm frame rates are not physical-device certification.

See the [visual handoff](docs/phase-4.5-final-visual-polish-handoff.md), [final UX handoff](docs/phase-4.5-final-ux-checkout-handoff.md), [release integration record](docs/phase-4.5-release-integration.md), and [architecture](docs/architecture.md). Historical phase documents describe the state when they were written.

To download the current GitHub source, select `main`, then **Code → Download ZIP** on the [repository](https://github.com/mohammedsunainali/ownthetop.space). This GitHub archive includes historical tracked QA evidence; the local release ZIP excludes QA archives and caches.
