## Why

The QA audit identified multiple security vulnerabilities in the frontend layer — most critically, JWT tokens are decoded but never cryptographically verified in the middleware, meaning any user can craft a cookie to impersonate any role. Additional gaps (no session expiry, unbounded form inputs, raw error exposure, wildcard image host) compound the risk.

## What Changes

- **BREAKING** `proxy.ts`: Middleware becomes async; JWT verification using Web Crypto API (HMAC-SHA256) replaces raw base64 decode — requires `JWT_SECRET` env var
- `app/api/auth/login/route.ts`: Add `maxAge: 60 * 60 * 8` (8 hours) to session cookie
- `next.config.ts`: Replace `hostname: '**'` wildcard with an explicit allowlist
- `components/catalog/OrderForm.tsx`: Add `.max()` constraints to `clientName` (100 chars) and `notes` (500 chars) in Zod schema
- `app/admin/users/new/page.tsx` & `app/admin/users/[id]/edit/EditUserForm.tsx`: Add Zod validation schema with length limits on name, email, password
- `app/login/page.tsx`: Remove `addToast(\`${err}\`, 'error')` raw error line and `console.log(err)`; show a generic message only

## Capabilities

### New Capabilities

- `jwt-verification`: Cryptographic JWT signature verification in Next.js Edge middleware using Web Crypto API

### Modified Capabilities

- (none — all changes are implementation-level fixes, no spec-level behavior changes for existing capabilities)

## Impact

- `proxy.ts` — function signature changes to `async`; requires `JWT_SECRET` environment variable
- `app/api/auth/login/route.ts` — cookie now expires after 8 hours
- `next.config.ts` — image domain allowlist must be configured per deployment
- `components/catalog/OrderForm.tsx`, `app/admin/users/new/page.tsx`, `app/admin/users/[id]/edit/EditUserForm.tsx` — Zod schema additions (non-breaking, additive validation)
- `app/login/page.tsx` — error toast message changed to generic string
