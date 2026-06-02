## Why

The redesigned login page introduced entirely new UI — split-panel layout, password visibility toggle, social login buttons, parallax effect, and Kafe brand tokens — but has zero test coverage. Without tests, regressions in the auth flow or interactive behaviors can go undetected.

## What Changes

- Create `app/login/page.test.tsx` covering the full surface of the new login page
- Tests cover: page structure (heading, fields, links, footer), password visibility toggle, Zod validation error messages, successful login flow with role-based redirect (ADMIN/BARISTA/CLIENT), error toast on bad credentials, error toast on network failure, loading/pending state on submit, and social button no-op behavior
- No existing test files modified

## Capabilities

### New Capabilities

- `login-page-test-coverage`: Unit/integration test suite for `app/login/page.tsx` using Vitest + Testing Library

### Modified Capabilities

<!-- No existing spec-level behavior changes -->

## Impact

- New file: `app/login/page.test.tsx`
- Mocks needed: `@/context/AuthContext`, `@/context/ToastContext`, `@/lib/api/generated/api`, `global.fetch`
- `next/navigation` and `next/image` are already globally mocked in `vitest.setup.tsx`
- No changes to production code
