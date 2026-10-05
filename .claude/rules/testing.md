# Testing

## Unit and component tests (Vitest)

- Vitest runs in `jsdom` with `vitest.setup.tsx`; `e2e/**` is excluded.
- Tests are colocated with the code, named `<file>.test.ts` / `<file>.test.tsx` (e.g. `lib/api/fetcher.test.ts`, `components/catalog/CategoryTabs.test.tsx`).
- Coverage is measured over `components/`, `context/`, `hooks/`, `lib/` (excluding `lib/api/generated/` and `lib/types/`) with thresholds: lines/statements/functions 80%, branches 75%. New code in those folders ships with tests.
- Mocking the generated hooks proves a component's own logic, not that the real integration works — see the Definition of done in `workflow.md`.

```bash
pnpm test:unit                 # vitest run
pnpm test:coverage             # with thresholds
pnpm exec vitest run path/to/file.test.ts
```

Note: `pnpm test` is `next lint`, not Vitest — use `pnpm test:unit` for unit tests.

## E2E tests (Playwright)

- Specs live in `e2e/` (`playwright.config.ts`); run with `pnpm test:e2e`.
- A task that wires a page or component to a real `kafe-api` endpoint is verified against a live API (the `run` skill, a manual click-through, or the relevant Playwright spec) before it is marked done.
- Auth or role-gated changes (`proxy.ts`, `AuthContext`, the `kafe_token` cookie) are verified by actually navigating as each affected role — including a direct-URL attempt as a disallowed role — not just by reading the middleware.
