## 1. Test Infrastructure Setup

- [x] 1.1 Install devDependencies: `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `@vitejs/plugin-react`
- [x] 1.2 Create `vitest.config.ts` at project root with jsdom environment, `@/` alias, setup file, and coverage include/exclude patterns
- [x] 1.3 Create `vitest.setup.tsx` that imports `@testing-library/jest-dom` and mocks `next/navigation` (useRouter, usePathname, useSearchParams) and `next/image`
- [x] 1.4 Add `test:unit` (`vitest run`) and `test:coverage` (`vitest run --coverage`) scripts to `package.json`
- [x] 1.5 Verify `pnpm test:unit` passes with an empty test suite (no tests found is OK at this stage)

## 2. Utility & Hook Tests

- [x] 2.1 Write `lib/utils.test.ts` — test `cn()` for class merging, conflict resolution, and falsy filtering
- [x] 2.2 Write `hooks/usePolling.test.ts` — use `vi.useFakeTimers()` to test interval firing, cleanup on unmount, and stale-closure avoidance
- [x] 2.3 Write `lib/hooks/useFormDirty.test.ts` — mock `window.confirm` and `next/navigation` router; test setDirty, confirmNavigation, and beforeunload listener lifecycle

## 3. API Layer Tests

- [x] 3.1 Write `lib/api/fetcher.test.ts` — mock global `fetch` with `vi.stubGlobal`; test URL + query param construction, Content-Type header, 200 JSON response, 204 empty response, and production env guard
- [x] 3.2 Write `lib/api/server-fetch.test.ts` — mock `next/headers` cookies; test session cookie forwarding and response shape

## 4. Context Tests

- [x] 4.1 Write `context/CartContext.test.tsx` — render `CartProvider` with a test consumer; test addItem, removeItem, updateQuantity (incl. zero quantity), clearCart, total, itemCount, sessionStorage persistence, and useCart-outside-provider error
- [x] 4.2 Write `context/AuthContext.test.tsx` — test initial null user, setUser, logout (mock fetch for the POST), and useAuth-outside-provider error
- [x] 4.3 Write `context/ToastContext.test.tsx` — mock `sonner` module; test addToast delegates to `toast.success`, `toast.error`, `toast.warning`, `toast.info`

## 5. Component Tests

- [x] 5.1 Write `components/catalog/ProductCard.test.tsx` — wrap with CartProvider + ToastProvider; test name/price rendering, addItem on click, disabled state for unavailable, and image fallback
- [x] 5.2 Write `components/catalog/CategoryTabs.test.tsx` — test tab count (categories + "Todos"), onSelect callback, and active-tab styling
- [x] 5.3 Write `components/barista/StatusButton.test.tsx` — test status label display and onStatusChange callback with next-state value
- [x] 5.4 Write `components/admin/ConfirmModal.test.tsx` — test hidden when closed, message display when open, onConfirm and onClose callbacks
- [x] 5.5 Write `components/ui/button.test.tsx`, `input.test.tsx`, `badge.test.tsx`, `skeleton.test.tsx`, `pagination.test.tsx` — one render smoke test each

## 6. Coverage Gate

- [x] 6.1 Run `pnpm test:coverage` and verify overall line coverage reaches ≥80%
- [x] 6.2 Add coverage threshold configuration to `vitest.config.ts` (`lines: 80, functions: 80, branches: 75`)
- [x] 6.3 Ensure CI workflow (`.github/workflows/`) includes a `pnpm test:coverage` step that fails the build below threshold
