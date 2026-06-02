## 1. Test File Setup

- [x] 1.1 Create `app/login/page.test.tsx` with `vi.mock` calls for `@/context/AuthContext`, `@/context/ToastContext`, and `@/lib/api/generated/api`
- [x] 1.2 Add a `renderLogin` helper that stubs `mockSetUser`, `mockAddToast`, `mockMutateAsync`, and `mockPush`, then renders `<LoginPage />`
- [x] 1.3 Add a `beforeEach` that resets all mocks and stubs `global.fetch` to resolve successfully for `/api/auth/login`

## 2. Static Structure Tests

- [x] 2.1 Test: "Welcome back" heading and subtext are present on render
- [x] 2.2 Test: email input, password input, and "Sign In" submit button are present
- [x] 2.3 Test: "Forgot Password?" and "Create an account" links are present
- [x] 2.4 Test: "Google" and "Apple" buttons are present
- [x] 2.5 Test: "or join the club" divider text is present
- [x] 2.6 Test: footer text "© 2024 Kafe Roastery. All rights reserved." is present
- [x] 2.7 Test: hero image has alt "The Ritual of Brewing"

## 3. Password Visibility Toggle Tests

- [x] 3.1 Test: password input starts with type="password" and toggle aria-label is "Show password"
- [x] 3.2 Test: clicking toggle changes input type to "text" and aria-label to "Hide password"
- [x] 3.3 Test: clicking toggle twice returns input type to "password"

## 4. Validation Error Tests

- [x] 4.1 Test: submitting with non-email value shows "Invalid email" error
- [x] 4.2 Test: submitting with password shorter than 8 chars shows "Password must be at least 8 characters"
- [x] 4.3 Test: submitting empty form shows errors for both fields

## 5. Successful Login Flow Tests

- [x] 5.1 Test: on 200 response with ADMIN role, router.push is called with "/admin/dashboard"
- [x] 5.2 Test: on 200 response with BARISTA role, router.push is called with "/barista/queue"
- [x] 5.3 Test: on 200 response with CLIENT role, router.push is called with "/orders/me"
- [x] 5.4 Test: on 200 response, fetch is called with "/api/auth/login" POST with token
- [x] 5.5 Test: on 200 response, setUser is called with the user from the response

## 6. Error Handling Tests

- [x] 6.1 Test: non-200 response calls addToast with "Invalid email or password" and "error"
- [x] 6.2 Test: mutateAsync throwing calls addToast with "Login failed. Please try again." and "error"

## 7. Loading State Tests

- [x] 7.1 Test: when isPending=true, button text is "Signing in…" and button is disabled
- [x] 7.2 Test: when isPending=false, button is not disabled and shows "Sign In"

## 8. Social Button Tests

- [x] 8.1 Test: Google button has type="button"
- [x] 8.2 Test: Apple button has type="button"

## 9. Run & Verify

- [x] 9.1 Run `pnpm test app/login/page.test.tsx` and confirm all tests pass with no act() warnings
