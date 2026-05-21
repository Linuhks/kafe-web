## Context

The project uses Next.js 16.2.1 with React 19 and TypeScript. No unit or integration test infrastructure exists — only a single Playwright E2E smoke test. Client components, contexts, hooks, and utility functions have no test coverage, making regressions invisible until manual or E2E testing catches them.

Target: ≥80% line coverage across client-side source files (`components/`, `context/`, `hooks/`, `lib/`).

## Goals / Non-Goals

**Goals:**
- Install and configure Vitest with jsdom + React Testing Library
- Achieve ≥80% line coverage on client-side logic
- Coverage threshold enforced in CI (build fails below 80%)
- Tests run fast (<30s) and in watch mode during development

**Non-Goals:**
- Testing Next.js server components or page files (RSC internals are not testable with jsdom)
- E2E coverage — Playwright handles that separately
- Testing Orval-generated code (`lib/api/generated/`)
- 100% coverage — edge cases beyond the 80% threshold are not required

## Decisions

### Vitest over Jest

**Decision**: Use Vitest as the test runner.

**Rationale**: Vitest has native ESM and TypeScript support without a Babel transform pipeline. It shares configuration with Vite and is significantly faster than Jest on cold starts. Jest would require `jest-environment-jsdom`, `babel-jest`, and several transform workarounds for Next.js's app router imports. Vitest resolves the same `@/` path alias from `tsconfig.json` automatically.

**Alternative considered**: Jest with `ts-jest` — rejected due to additional config overhead and slower iteration.

### @vitest/coverage-v8 over istanbul

**Decision**: Use V8's built-in coverage (`@vitest/coverage-v8`) rather than istanbul.

**Rationale**: V8 coverage runs at the engine level with no instrumentation overhead and no additional Babel plugin. Istanbul requires source-map transforms; V8 does not. For a TypeScript + Next.js project, V8 is simpler to configure.

### Test co-location

**Decision**: Place test files alongside source in `__tests__/` subdirectories or as `*.test.ts(x)` siblings.

**Rationale**: Co-location keeps tests discoverable and makes it obvious when a file has no tests. A top-level `tests/` folder creates path-mirroring maintenance burden.

### Mocking strategy

**Decision**: Mock at the module boundary — mock `next/navigation`, `next/image`, and external APIs via `vi.mock()`. Do NOT mock internal modules (context, hooks) in component tests; render with real providers.

**Rationale**: Mocking `next/navigation` and `next/image` is unavoidable because these modules invoke Node internals that jsdom doesn't support. Mocking internal code (e.g., wrapping CartContext) creates false confidence and hides integration bugs between components and their contexts.

### vitest.setup.ts for jest-dom matchers

**Decision**: Use a single `vitest.setup.ts` that imports `@testing-library/jest-dom` to register DOM matchers globally.

**Rationale**: Avoids repetitive imports in every test file and matches the community convention.

## Risks / Trade-offs

- **RSC files not covered** → Any logic in server components won't count toward coverage. Mitigation: extract shared logic into pure utility functions in `lib/`.
- **sessionStorage in jsdom** → jsdom provides a stub but state persists between tests in the same suite. Mitigation: call `sessionStorage.clear()` in `beforeEach` for CartContext tests.
- **Next.js Image mock** → Mocking `next/image` with a plain `<img>` loses `onError` behavior fidelity. Mitigation: test the fallback state by simulating `onError` directly on the mock element.
- **Coverage threshold blocks CI** → Setting 80% from day one may block the pipeline until tests are written. Mitigation: threshold is only enabled once the test suite passes; initial CI run uses `--reporter=verbose` without threshold.
