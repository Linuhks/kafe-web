## Context

All features are implemented: public catalog, client auth + order history, barista queue, admin dashboard, product/category/user/inventory CRUD. The application has never been run through a coordinated end-to-end pass. A `.env.local.example` file does not exist, so new contributors have no reference for required configuration.

## Goals / Non-Goals

**Goals:**
- Create `.env.local.example` with all environment variables needed to run the frontend
- Execute all five role-based flows and record what passes or fails
- Fix any discovered regressions without introducing new features
- Confirm `proxy.ts` protects every restricted route correctly

**Non-Goals:**
- Automated test suite (Playwright, Cypress, Vitest)
- Performance benchmarking
- Backend changes
- New features or UX improvements

## Decisions

**Manual testing over automated tests**
The codebase has no testing infrastructure. Setting up Playwright or Vitest in the same task would expand scope significantly and delay shipping the validated build. Manual testing against the running dev server is the fastest path to a known-good baseline.
Alternatives considered: Playwright smoke tests — deferred to a future change.

**Fix bugs in place, no compatibility shims**
Any bug found during testing is fixed directly. No feature flags or fallbacks are introduced.

**`.env.local.example` is the single source of truth for env vars**
Rather than documenting env vars in README (which drifts), the example file is colocated with the actual `.env.local` convention Next.js uses. CI/CD can validate the example exists.

## Risks / Trade-offs

- Manual testing may miss edge cases not covered by the five flows → Mitigation: follow the full scenario checklist from the task spec
- Env var list may become stale as features evolve → Mitigation: keep the example file minimal (only required vars)
