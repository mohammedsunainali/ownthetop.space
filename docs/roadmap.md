# Product roadmap boundary

## Phase 1 — Foundation + Architecture (implemented)

- Application, lint, typecheck, test, build, and CI foundation
- Domain types and integer-money helpers
- Pure per-tower ranking engine with deterministic tests
- Deterministic fictional data for 40 listings
- Three configurable procedural tower shells
- Camera modes, floor selection, and profile drawer
- Minimal responsive shell and WebGL environment

## Deferred beyond Phase 1

Later phases may address production visual language, richer environments, persistence, payments, authentication, realtime synchronization, content ingestion, analytics, sharing workflows, and browser-level end-to-end coverage. Their providers and detailed architecture are intentionally not selected or implemented here.

Phase 1 must remain a stable skeleton: later work decorates or integrates with the established domain-to-ranking-to-world-to-presentation direction rather than moving ranking authority into the renderer.
