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

### How the E2E suite works

- It runs against a **live `kafe-api` with the seed data** (`pnpm seed`), never against mocks of the whole API. Individual tests stub a single endpoint with `page.route` only to reach an error branch.
- `e2e/auth.setup.ts` (the `setup` project) signs in once per role straight against the API and saves cookies to `playwright/.auth/<role>.json` (gitignored). Specs pick a role with `test.use({ storageState: authFile('admin') })`; no `storageState` means signed out. Saved sessions are reused until the API rejects them.
- **Raise the API rate limits before running.** `kafe-api` throttles to 10 req/min per IP (5 for login); a full run needs far more, otherwise the menu degrades to "unavailable" and logins return 429. Start the API with `THROTTLE_LIMIT=100000 THROTTLE_AUTH_LIMIT=100000 pnpm start:dev` (variables added in `kafe-api`; defaults are unchanged).
- Helpers: `e2e/support/api.ts` (API login, `apiAs(role)`, order/category/product helpers, unique `uid()` names, cleanup), `e2e/support/hydration.ts` (`waitForHydration`).
- **Wait for hydration before the first fill/click** on server-rendered forms and buttons. Interacting before React attaches its handlers silently drops the action and makes the test flaky.
- Tests create their own data with unique names (`uid()`), assert through the API where it matters, and delete what they created in `afterAll`. Orders cannot be deleted, so the seed database slowly accumulates them.
- Known app bugs are encoded, not hidden: `test.fail(...)` passes while the bug exists and starts failing when it is fixed (then turn it into a plain `test`); `test.fixme(...)` marks a flow that cannot run yet. Search the specs for `Known bug` / `Known gap`.
- The list pages are server-paginated (20/page) and client-side search only filters the current page; locate rows created by a test through the API's page number, not the search box.

