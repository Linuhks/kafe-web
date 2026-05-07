## 1. Environment Setup

- [x] 1.1 Add `JWT_SECRET` to `.env.local` (must match the backend value)
- [x] 1.2 Add `JWT_SECRET` to `.env.example` with a placeholder and a comment explaining it must match the backend

## 2. JWT Signature Verification in Middleware

- [x] 2.1 Rewrite `proxy.ts`: replace `decodeJwtPayload` with an async `verifyAndDecodeJwt(token, secret)` function using `crypto.subtle.importKey` + `crypto.subtle.verify`
- [x] 2.2 Make the `proxy` export function `async` and await the verification result
- [x] 2.3 Read `JWT_SECRET` from `process.env.JWT_SECRET`; if absent, return `null` (fail-closed)
- [x] 2.4 Verify the HMAC-SHA256 signature before extracting the role claim
- [x] 2.5 Update `middleware.ts` (or wherever `proxy` is called) to `await` the now-async function

## 3. Session Cookie Expiry

- [x] 3.1 Add `maxAge: 60 * 60 * 8` to the `cookieStore.set` call in `app/api/auth/login/route.ts`

## 4. Image Domain Allowlist

- [x] 4.1 Remove the `{ protocol: 'https', hostname: '**' }` entry from `next.config.ts`
- [ ] 4.2 Add any known production CDN hostname explicitly (e.g. your image storage domain); document in `.env.example` if it varies by environment

## 5. Form Input Length Limits

- [x] 5.1 In `components/catalog/OrderForm.tsx`: update `orderSchema` — add `.max(100)` to `clientName` and `.max(500)` to `notes`, with descriptive error messages
- [x] 5.2 In `app/admin/users/new/page.tsx`: introduce a Zod schema with `.max()` on `name` (100), `email` (254), and `password` (128); wire it up with react-hook-form
- [x] 5.3 In `app/admin/users/[id]/edit/EditUserForm.tsx`: add the same length constraints to the existing edit schema

## 6. Login Error Hardening

- [x] 6.1 In `app/login/page.tsx`: remove `addToast(\`${err}\`, 'error')` (line 64)
- [x] 6.2 Remove `console.log(err)` (line 62); replace with `console.error(err)` if logging is still desired during development

## 7. Verification

- [x] 7.1 Manually test login with a valid token — confirm access works normally
- [x] 7.2 Manually test with a crafted cookie (`role: "ADMIN"`, fake signature) — confirm redirect to `/login`
- [x] 7.3 Confirm the auth cookie has `Max-Age=28800` in DevTools → Application → Cookies
- [x] 7.4 Test order form with a 101-character `clientName` — confirm validation error appears
- [x] 7.5 Confirm product images from `localhost` still load in development
