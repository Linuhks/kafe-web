## Why

The project has no unit or integration tests — only a single Playwright smoke spec. Without a unit test layer, regressions in utilities, hooks, and components go undetected until E2E or manual testing. Reaching ~80% line coverage requires adding Vitest + React Testing Library and systematically covering the existing source files.

## What Changes

- Install and configure Vitest and React Testing Library as dev dependencies
- Add `test:unit` and `test:coverage` scripts to `package.json`
- Configure `vitest.config.ts` with jsdom environment and coverage thresholds
- Write unit tests for: utilities, hooks, API fetcher, context providers, and UI/feature components
- Set coverage threshold to 80% in CI to prevent regression

## Capabilities

### New Capabilities

- `unit-test-setup`: Install Vitest + React Testing Library, configure jsdom environment, add coverage scripts and CI threshold gate
- `utils-hooks-coverage`: Unit tests for `lib/utils.ts`, `hooks/usePolling.ts`, and `lib/hooks/useFormDirty.ts`
- `api-layer-coverage`: Unit tests for `lib/api/fetcher.ts`, `lib/api/server-fetch.ts`, and the domain API modules (`categories`, `products`, `orders`, `inventory`, `users`, `dashboard`)
- `context-coverage`: Unit tests for `context/CartContext.tsx`, `context/AuthContext.tsx`, and `context/ToastContext.tsx`
- `component-coverage`: Unit tests for UI primitives (`button`, `input`, `badge`, `dialog`, `pagination`, `select`, `skeleton`) and key feature components (`ProductCard`, `CategoryTabs`, `OrderForm`, `CartSidebar`, `StatusButton`, `ConfirmModal`)

### Modified Capabilities

## Impact

- `package.json`: new devDependencies (vitest, @vitest/coverage-v8, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom), new scripts
- New `vitest.config.ts` at project root
- New `vitest.setup.ts` for jest-dom matchers
- New test files co-located with source or under `__tests__/`
- `ci-pipeline` spec: coverage threshold check added to CI workflow
