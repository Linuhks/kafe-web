# app/

## Server vs Client Components

- `page.tsx` files are **Server Components** by default — fetch data directly, no hooks
- Add `'use client'` only when you need interactivity, hooks, or browser APIs
- Layouts are server components; providers live in `app/layout.tsx`

## Route Map

| Route | Component | Access |
|---|---|---|
| `/` | `app/page.tsx` | public |
| `/login` | `app/login/page.tsx` | public (redirects if authed) |
| `/barista/queue` | `app/barista/queue/page.tsx` | BARISTA, ADMIN |
| `/admin/*` | not yet built | ADMIN |
| `/orders/me` | not yet built | CLIENT |

## Auth Flow

1. Login form POSTs to `/api/auth/login` (Next.js Route Handler)
2. Route Handler sets `kafe_token` httpOnly cookie
3. Page redirects based on role: ADMIN → `/admin/dashboard`, BARISTA → `/barista/queue`, CLIENT → `/orders/me`
4. `proxy.ts` (middleware) enforces access on every request — do not duplicate this logic in pages

@app/api/CLAUDE.md
