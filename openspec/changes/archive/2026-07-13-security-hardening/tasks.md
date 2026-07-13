## 1. CSP Hardening (next.config.ts)

- [x] 1.1 Remove `'unsafe-eval'` from the `script-src` directive in `next.config.ts`
- [x] 1.2 Add `https://fonts.googleapis.com` to the `style-src` directive in `next.config.ts`
- [x] 1.3 Add `https://fonts.gstatic.com` to the `font-src` directive in `next.config.ts`
- [x] 1.4 Verify in browser DevTools that no CSP violations are reported on page load (check for Material Symbols icons rendering and no `eval` violations)

## 2. HSTS Header (next.config.ts)

- [x] 2.1 Add `{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }` to the headers block in `next.config.ts`
- [x] 2.2 Confirm the header appears in a `curl -I` response or browser DevTools Network tab

## 3. Rate Limiter Hardening (app/api/auth/login/route.ts)

- [x] 3.1 Add a comment above the `attempts` Map documenting it as per-instance, non-persistent, and not shared across processes
- [x] 3.2 Read the IP from `process.env.TRUSTED_PROXY_HEADER ?? 'x-forwarded-for'` instead of hardcoding `'x-forwarded-for'`
- [x] 3.3 If the resolved header value is absent or empty after trimming, return `429` immediately (no shared `'unknown'` bucket)
- [x] 3.4 In `isRateLimited`, when an expired entry is found, `delete` it from the Map and create a fresh entry (prune instead of reset)
- [x] 3.5 Manually test that a request without `x-forwarded-for` returns 429 (use `curl -X POST /api/auth/login -d '{"token":"a.b.c"}'` with no proxy header)
- [x] 3.6 Manually test that rotating fake `x-forwarded-for` IPs does not bypass the limit when `TRUSTED_PROXY_HEADER` is set to a header the client cannot reach

## 4. Token Format Validation (app/api/auth/login/route.ts)

- [x] 4.1 After the `typeof token !== 'string'` check, add a JWT shape guard: `/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)` must be true, else return `{ message: 'Invalid token format' }` with status 400
- [x] 4.2 Verify that a normal login still succeeds end-to-end (the backend-issued JWT passes the shape guard)
- [x] 4.3 Verify that sending `{ "token": "notajwt" }` returns 400

## 5. Dockerfile Build ARG (Dockerfile)

- [x] 5.1 In the builder stage, replace `ENV NEXT_PUBLIC_API_URL=https://kafe-api-latest.onrender.com` with `ARG NEXT_PUBLIC_API_URL` followed by `ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL`
- [ ] 5.2 Verify `docker build .` (without `--build-arg`) succeeds and falls back to localhost (build will succeed; runtime server-side calls will fail — expected)
- [ ] 5.3 Verify `docker build --build-arg NEXT_PUBLIC_API_URL=https://kafe-api-latest.onrender.com .` succeeds and the URL does not appear hardcoded in the Dockerfile
