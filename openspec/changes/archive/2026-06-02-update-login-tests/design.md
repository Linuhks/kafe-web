## Context

The project uses Vitest + Testing Library (jsdom). `vitest.setup.tsx` globally mocks `next/navigation` (full router shape) and `next/image` (renders a plain `<img>`). The coverage config includes `components/**`, `context/**`, `hooks/**`, `lib/**` — `app/**` is excluded from thresholds, but a test file there still runs and is tracked. The new login page mixes three external dependencies that must be mocked per-test: `useAuth`, `useToast`, and `useAuthControllerLogin`.

## Goals / Non-Goals

**Goals:**
- Cover all interactive behaviors: password toggle, form validation, login success/failure paths, loading state, social button no-op
- Cover role-based redirect for all three roles (ADMIN, BARISTA, CLIENT)
- Verify static structure: heading, labels, links, footer text, hero image alt
- All tests run in isolation with no real network or router calls

**Non-Goals:**
- E2E or visual regression testing — those belong in Playwright (`e2e/`)
- Testing CSS variables or token values — token correctness is a visual concern
- Testing the parallax `mousemove` effect — JSDOM doesn't implement `mousemove` geometry meaningfully

## Decisions

### 1. Test file location: `app/login/page.test.tsx`

Co-located with the page, consistent with the `ExplorarCardapioButton.test.tsx` pattern (tests next to their component). Alternative (`__tests__/login.test.tsx`) was rejected — no such folder exists in the project.

### 2. Mock strategy: `vi.mock` at module level for all three dependencies

`useAuth`, `useToast`, and `useAuthControllerLogin` are all React hooks called at the top of `LoginPage`. Mocking at module level (outside `describe`) ensures hooks are replaced before any render. Per-test customization is done via `vi.mocked(...).mockReturnValue(...)` in `beforeEach`.

`global.fetch` is stubbed per-test via `vi.stubGlobal('fetch', ...)` (same pattern as `AuthContext.test.tsx`) to intercept the `/api/auth/login` POST.

### 3. No provider wrappers needed

Because `useAuth` and `useToast` are mocked at module level, there is no need to wrap renders in `AuthProvider` / `ToastProvider` / `QueryProvider`. This keeps tests fast and isolated.

### 4. Async form submission: `waitFor` + `userEvent`

`@testing-library/user-event` v14 (already used throughout the project) handles `type`, `click`, and `submit`. Form submissions are async (React Hook Form + async `onSubmit`), so assertions go inside `waitFor`.

### 5. Validation testing: submit empty, then check error text

Zod validation fires on submit. The pattern is: render → `userEvent.click(submitButton)` → `waitFor(() => getByText('Invalid email'))`. No need to inspect DOM structure beyond the text node.

## Risks / Trade-offs

- **[JSDOM image rendering]** `next/image` is mocked to a plain `<img>`. The alt text assertion works, but `fill` layout and `priority` props are dropped. → Acceptable: we test what matters (alt accessibility), not Next.js internals.
- **[Role-based redirect coverage]** Three separate test cases for ADMIN/BARISTA/CLIENT increase verbosity. → Worth it: the `dashboardForRole` branches are untested otherwise and are high-value regression targets.
- **[Async timing]** RHF + Zod validation is synchronous, but the DOM update is async. Using `waitFor` consistently avoids flaky act() warnings. → Follow the same `waitFor` pattern used in `AuthContext.test.tsx`.
