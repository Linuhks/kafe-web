## Why

A security scan uncovered eight real vulnerabilities across the HTTP security headers, login rate limiter, session cookie handling, and Docker build process. One reported critical finding (middleware not running) was confirmed as a false positive — Next.js 16 added `proxy.ts` as a first-class middleware filename (`PROXY_FILENAME = 'proxy'`), and the current export name `proxy` is correct. The remaining issues leave the app exposed to brute-force attacks, clickjacking-adjacent CSP gaps, and production config baked into build artifacts.

## What Changes

- **CSP `unsafe-eval` removed** — `script-src` currently allows `eval()`, neutralising XSS defences in production where it is not needed
- **CSP Google Fonts domains added** — `font-src 'self'` and `style-src` do not include `fonts.googleapis.com` / `fonts.gstatic.com`, silently blocking the Material Symbols icon font already loaded in `layout.tsx`
- **HSTS header added** — `Strict-Transport-Security` missing from `next.config.ts` headers block, allowing SSL-strip downgrade attacks
- **Rate limiter: IP spoofing hardened** — `x-forwarded-for` is read directly from client-supplied headers, allowing an attacker to rotate fake IPs and bypass the 10-attempt cap entirely
- **Rate limiter: shared `'unknown'` bucket removed** — requests without an identifiable IP currently all share one bucket, causing a self-inflicted login DoS in direct-to-server deployments
- **Rate limiter: memory growth documented and bounded** — the in-memory `Map` grows unboundedly until process restart; expired entries are never pruned
- **Dockerfile production URL de-hardcoded** — `ENV NEXT_PUBLIC_API_URL=https://kafe-api-latest.onrender.com` bakes the production backend URL into every image layer; should be a build `ARG` injected from CI secrets
- **Token format validation added** — `/api/auth/login` stores any string as `kafe_token` with no structural check; a JWT shape guard prevents storing garbage in the cookie

## Capabilities

### New Capabilities

- `csp-hardening`: Correct Content-Security-Policy — remove `unsafe-eval` from `script-src`, add `fonts.googleapis.com` to `style-src`, add `fonts.gstatic.com` to `font-src`
- `security-headers`: Add `Strict-Transport-Security` header (`max-age=63072000; includeSubDomains; preload`) to all routes
- `login-rate-limiter`: Harden the in-process rate limiter — reject unidentifiable IPs with 429, replace `x-forwarded-for` trust with a configurable trusted-proxy approach, prune expired entries to bound memory growth
- `token-cookie-validation`: Validate that the value passed to `/api/auth/login` has JWT structure (three base64url segments separated by dots) before writing the `kafe_token` cookie

### Modified Capabilities

- `container-build`: Replace the hardcoded `ENV NEXT_PUBLIC_API_URL=...` in the Dockerfile builder stage with a build `ARG` so the URL is injected at CI build time rather than embedded in the image

## Impact

- `next.config.ts` — CSP and HSTS header changes
- `app/api/auth/login/route.ts` — rate limiter hardening and token format validation
- `Dockerfile` — `ARG NEXT_PUBLIC_API_URL` replaces `ENV NEXT_PUBLIC_API_URL=...`
