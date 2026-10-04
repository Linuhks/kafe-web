---
name: frontend-patterns
description: Frontend patterns for kafe-web (Next.js 16 App Router, React 19, Tailwind 4, shadcn/Radix, Orval + React Query, next-intl, react-hook-form + zod, Vitest). Use when adding or reviewing pages, components, data fetching, forms, i18n, access control or tests in this repo.
metadata:
  origin: ECC (rewritten for kafe-web)
---

# kafe-web Frontend Patterns

Next.js 16 App Router consuming `kafe-api`. This skill summarizes patterns the code **already uses**; the source of truth is `CLAUDE.md`, the folder `CLAUDE.md` files, and `docs/code-guide.md`. If this skill and the code disagree, the code wins — fix the skill.

## When to Activate

- Adding or changing a page, layout, component, hook or context
- Fetching data (server or client), mutations, polling
- Building forms, toasts, translated copy
- Gating a route or action by role
- Writing component tests or E2E specs

## Server vs Client components

Default to **Server Components**; add `'use client'` only for state/effects, browser APIs, React Query hooks or event handlers.

Two data-fetching paths coexist — pick by where the code runs:

```typescript
// Server Component (admin list pages): manual module in lib/api/*.ts, built on serverFetch
export const dynamic = 'force-dynamic'
export default async function AdminUsersPage() {
  const { users } = await getUsers()           // lib/api/users.ts
  return <UsersTable users={users} />          // client component gets plain props
}

// Client Component (live screens): Orval-generated React Query hooks
const queueQuery = useOrdersControllerQueue({ query: { refetchInterval: 15_000 } })
const orders = queueQuery.data?.status === 200 ? queueQuery.data.data : []
```

- `serverFetch()` (`lib/api/server-fetch.ts`) reads the `kafe_token` cookie and adds `Authorization`. Server-only (`next/headers`).
- Generated hooks live in `lib/api/generated/api.ts` — **git-ignored, never edit**; regenerate with `pnpm generate:api` (needs the API reachable per `orval.config.ts`). Missing file on a fresh clone = run it first.
- Everything goes through `apiFetch` (`lib/api/fetcher.ts`): it returns `{ data, status, headers }` and does **not** throw on non-2xx. Always narrow on `status` (`=== 200`, `=== 201`) before using `data`.
- Client calls use relative `/api/v1/*`, rewritten to the API in `next.config.ts`; `proxy.ts` injects the bearer token for those requests. Don't call the API host directly from the browser or from Route Handlers.
- Don't mix: no hooks in Server Components, no `serverFetch` in Client Components.

## Mutations and live data

```typescript
const updateStatus = useOrdersControllerUpdateStatus({
  mutation: {
    onSuccess: () => { queueQuery.refetch(); addToast(t('updated'), 'success') },
    onError: () => addToast(t('updateError'), 'error'),
  },
})
await updateStatus.mutateAsync({ id, data: { status } })
```

- Live queues poll with `refetchInterval: 15_000` on the query (barista and admin queues). `hooks/usePolling.ts` is for non-query callbacks.
- After a mutation, refetch/invalidate the affected queries explicitly.
- Track per-item pending state from `mutation.variables?.id` (see barista page) instead of one global spinner.
- Show `Skeleton` while `isPending`, an explicit empty state otherwise.

## Access control: `proxy.ts` is the gate

- Role checks live in `proxy.ts` (it asks the API `get-session`). Pages and components **don't duplicate** it.
- Hiding a link or button by role is UX, not security. A new role-gated route/action must be enforced in `proxy.ts` (or by the API for data), and verified by hitting the direct URL as a disallowed role before calling the task done.
- Entry routes: CLIENT `/cardapio` (orders at `/orders/me`), BARISTA `/barista/queue`, ADMIN `/admin/dashboard`.
- Auth cookie `kafe_token`: `httpOnly`, `sameSite: strict`, `secure` in prod, 8h. Never read it from client JS; never put tokens in `localStorage`.
- Route Handlers under `app/api/` exist only to manage that cookie (`/api/auth/login|logout`); no business logic.

## State and contexts

Provider tree in `app/layout.tsx`: `NextIntlClientProvider → QueryProvider → AuthProvider → CartProvider → ToastProvider`.

- `useAuth()` `{ user, setUser, logout }` · `useCart()` (persisted in `sessionStorage` key `kafe_cart`) · `useToast()` `{ addToast(message, type) }` with `success | error | warning | info`.
- Server data → React Query. Cross-cutting UI state → the existing contexts. Local UI state → `useState`. Don't copy server data into context.
- Reading `sessionStorage`/`window` only inside effects or client components to avoid hydration mismatches.

## Components and styling

- Check `components/ui/` (shadcn/Radix: badge, button, dialog, input, pagination, select, skeleton, sonner) **before** building a primitive.
- Feature components go in `components/<area>/` (`admin`, `barista`, `catalog`, `confirmation`, `landing`, `layout`), `PascalCase.tsx`, default export, props typed with an `interface <Name>Props`.
- Merge classes with `cn()` from `lib/utils.ts` — never concatenate class strings.
- Use the `--kafe-*` design tokens / Tailwind utilities from `app/globals.css` (`text-kafe-*`, `bg-kafe-*`, `text-headline-lg`, ...); don't hardcode hex colors.
- Icons: `lucide-react` only.
- Use the generated DTO types (`OrderResponseDto`, ...) or `lib/types`; no `any` (`unknown` + narrowing; `catch (err: unknown)`).

## Forms

`react-hook-form` + `zod` + `zodResolver`, with the schema next to the component and `z.infer` for the field type:

```typescript
const schema = z.object({ notes: z.string().max(500).optional() })
type Fields = z.infer<typeof schema>
const { register, handleSubmit, formState: { errors } } = useForm<Fields>({ resolver: zodResolver(schema) })
```

Submit through a generated mutation hook, branch on `response.status`, report with `addToast`. Client validation is UX only; the API validates again.

## i18n (next-intl, pt-BR)

- Copy lives in `messages/pt-BR.json` (mirrored in `en-US.json`); locale is fixed to `pt-BR` in `i18n/request.ts`.
- Server: `const t = await getTranslations('dashboard')`. Client: `useTranslations(...)`.
- ESLint `i18next/no-literal-string` is an **error** for `app/**` and `components/**` (not `components/ui` or tests): new JSX text must go through the catalog. Some older files (e.g. barista queue) still hold literal Portuguese — migrating is welcome, copying that style into new code is not.
- Add keys to both locale files; `messages/catalog.test.ts` checks the catalogs.
- Format money/dates with `Intl.NumberFormat('pt-BR', ...)` / `toLocaleString('pt-BR')`.

## Security

- Never `dangerouslySetInnerHTML` with API/user content; render as text.
- Only `NEXT_PUBLIC_*` env vars reach the browser — no secrets in them. `NEXT_PUBLIC_API_URL` is required in production.
- `next.config.ts` sets CSP and security headers. A new external origin (images, fonts, API) needs a matching CSP entry (`connect-src`, `img-src`, ...) or it will be blocked.
- Remote images: allow the host in `images.remotePatterns` and use `next/image`.

## Testing

- Vitest + Testing Library + jsdom, `@/` alias, tests colocated as `Component.test.tsx`. Coverage thresholds: 80% lines/statements/functions, 75% branches.
- Render with `render` from `@/lib/test-utils` when the component uses next-intl (wraps `NextIntlClientProvider` with pt-BR); plain `@testing-library/react` otherwise.
- Query by role/label (`getByRole('button', { name: /iniciar preparo/i })`), drive with `userEvent`, mock callbacks with `vi.fn()`.
- Async server components are tested by awaiting the function and rendering the result; mock `next-intl/server` `getTranslations` (see `DashboardInventoryAlerts.test.tsx`).
- E2E: Playwright in `e2e/` (`pnpm test:e2e`); keep to critical user journeys (login, order, queue).

## Checklist for a new screen

1. Page in `app/<area>/.../page.tsx` as a Server Component; data via `lib/api/*` or, for live screens, a client component with generated hooks
2. Route gated in `proxy.ts` if role-restricted; verify the direct URL as another role
3. Components in `components/<area>/`, reuse `components/ui/`, `cn()`, `--kafe-*` tokens
4. Copy through `messages/pt-BR.json` (+ `en-US.json`)
5. Forms with RHF + zod; mutations via generated hooks; toasts via `useToast`
6. Colocated `*.test.tsx`
7. Gate before each commit: `pnpm lint` then `pnpm build` (add `pnpm test:unit` when touching logic)
