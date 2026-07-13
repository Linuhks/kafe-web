## Context

The app's HTTP security posture has several gaps identified in a security audit. The middleware (`proxy.ts`) is correctly running in Next.js 16 — the reported critical finding was a false positive. The remaining eight issues split into four areas: Content Security Policy misconfigurations (`next.config.ts`), missing HSTS header (`next.config.ts`), a fragile in-process rate limiter (`app/api/auth/login/route.ts`), and production-URL leakage in the Dockerfile.

No Redis or external rate-limiting infrastructure is available. All fixes must stay in-process or in configuration files.

## Goals / Non-Goals

**Goals:**
- Remove `'unsafe-eval'` from CSP `script-src` without breaking the app in production
- Fix CSP `font-src` and `style-src` to match the Google Fonts already loaded in `layout.tsx`
- Add `Strict-Transport-Security` to all responses
- Make the login rate limiter resistant to IP spoofing and the shared-`'unknown'`-bucket DoS
- Prune stale rate-limit entries to prevent memory growth
- Stop baking `NEXT_PUBLIC_API_URL` into the Docker image at build time
- Validate JWT shape before writing `kafe_token` cookie

**Non-Goals:**
- Replacing the in-process rate limiter with Redis (no infrastructure; acceptable for a single-instance deployment)
- Implementing CSP nonces to replace `'unsafe-inline'` in `script-src` (scope too large; tracked separately if needed)
- Self-hosting Google Fonts (extending CSP is lower-risk and keeps the existing loading strategy)
- Changing the cookie `secure: false` in development (acceptable local behaviour)

## Decisions

### D1 — Remove `'unsafe-eval'`, keep `'unsafe-inline'`

Next.js 16 / React 19 in production does not use `eval()`. `'unsafe-eval'` can be removed from `script-src` outright. `'unsafe-inline'` is kept for now because removing it requires nonce injection through every middleware response — that is a separate effort. The immediate gain is removing the larger of the two risks.

**Alternatives:** Implement full nonce-based CSP. Rejected for this change — it requires changes to `proxy.ts`, all `<script>` tags in the app, and potentially the Radix UI / Sonner libraries. Deferred.

### D2 — Extend CSP for Google Fonts rather than self-host

`layout.tsx` loads `Material Symbols Outlined` from `fonts.googleapis.com` (CSS) and `fonts.gstatic.com` (woff2). The current `font-src 'self'` and `style-src 'self' 'unsafe-inline'` silently block both. The fix adds `https://fonts.googleapis.com` to `style-src` and `https://fonts.gstatic.com` to `font-src`.

**Alternatives:** Self-host the fonts in `/public/fonts/`. Rejected for this change — it requires downloading and committing font files, adding `@font-face` declarations, and testing fallback rendering. Lower priority than the security fixes.

### D3 — Rate limiter: reject unidentifiable IPs instead of sharing `'unknown'` bucket

When `x-forwarded-for` is absent (direct connection, no reverse proxy), the current code falls back to `'unknown'`, which means all such clients share one 10-attempt budget. The fix returns `429` immediately when no IP can be determined. This is the correct fail-closed behaviour: a direct connection to a Next.js server in production should always arrive through a reverse proxy; the absence of the header indicates a misconfiguration.

**Alternatives:** Use a default per-process bucket for unknown IPs. Rejected — this gives unknown-IP callers unlimited attempts as long as they space them out across rate-limit windows.

### D4 — Rate limiter: read `x-forwarded-for` trusting only the last hop configured by a trusted proxy

The `x-forwarded-for` header is a client-controlled comma-separated list. An attacker can prepend arbitrary IPs. The correct approach for a single-hop reverse-proxy setup (typical for this app on Render/Fly/Railway) is to read only the first IP but document that the operator must ensure the proxy sets this header and clients cannot reach Next.js directly.

A more robust alternative is to read the `cf-connecting-ip` (Cloudflare) or `x-real-ip` header set by the infrastructure, since those cannot be set by clients. The fix reads `x-forwarded-for` first, but adds a `TRUSTED_PROXY_HEADER` env var escape hatch so operators deploying behind Cloudflare can point to `cf-connecting-ip` instead.

**Alternatives:** Trust the entire `x-forwarded-for` chain and extract the leftmost IP (client's actual IP in a correctly-configured proxy chain). Rejected — this is still spoofable if the proxy does not strip client-supplied headers.

### D5 — Rate limiter: prune expired entries in the cleanup pass

The `attempts` Map grows by one entry per unique IP and is never pruned. After a traffic spike the Map may hold tens of thousands of stale entries. The fix adds a sweep on each `isRateLimited` call: when an entry is found to be expired it is deleted instead of being reset in-place. This is O(1) per call (no full scan), and amortises cleanup across normal traffic.

**Alternatives:** A `setInterval` background sweeper. Rejected — it adds complexity and runs even when the server is idle; the on-demand approach is simpler and sufficient.

### D6 — Dockerfile: `ARG` for `NEXT_PUBLIC_API_URL`

The builder stage currently sets `ENV NEXT_PUBLIC_API_URL=https://kafe-api-latest.onrender.com`, which bakes the production URL into the image. The fix changes it to:

```dockerfile
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
```

CI passes `--build-arg NEXT_PUBLIC_API_URL=${{ secrets.API_URL }}`. If the arg is omitted, `next build` falls back to `http://localhost:3333` (the existing `getApiUrl()` fallback), which will fail on server-side routes in production — acceptable because a missing build arg should be a visible build-time failure.

**Alternatives:** Remove `NEXT_PUBLIC_API_URL` from `proxy.ts` and `session/route.ts` so the server-side code always routes via the Next.js rewrite. Rejected for this change — it requires refactoring how `proxy.ts` calls the backend session endpoint, which is a separate concern.

### D7 — Token validation: JWT shape guard

`/api/auth/login` accepts any non-empty string. A JWT has the form `xxxxx.yyyyy.zzzzz` (three base64url segments). The guard checks this with a regex before writing the cookie. It does not verify the signature (that is the backend's job on each request). The purpose is to prevent callers from storing clearly malformed values that can never be valid.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Removing `'unsafe-eval'` breaks a library that uses `eval()` in production | Verify with `next build && next start` and check browser console for CSP violations before shipping |
| Extending CSP with Google Fonts domains widens the allowed style-load surface | Acceptable — the fonts are already being fetched (and currently blocked), so this restores intended behaviour rather than expanding it |
| Returning 429 for unknown-IP requests breaks clients in direct-to-server setups | This is intentional: production should always route through a proxy. Document in env-configuration spec |
| Build fails if `NEXT_PUBLIC_API_URL` ARG is not passed | Intentional. CI must pass the build arg. Add it to `.env.local.example` with a comment |
| In-memory rate limiter still resets on deploy | Accepted limitation with no Redis available. Document as a known limitation in code comment |

## Migration Plan

1. Apply all `next.config.ts` header changes and verify locally with browser DevTools → Network → response headers
2. Apply rate limiter hardening; test with and without `x-forwarded-for` header
3. Update Dockerfile; update CI pipeline to pass `--build-arg NEXT_PUBLIC_API_URL=...`
4. Apply token validation; verify login still works end-to-end
5. Deploy; confirm CSP violations not reported in browser console

Rollback: all changes are configuration or single-file — revert the relevant file and redeploy.

## Open Questions

- Should `TRUSTED_PROXY_HEADER` default to `x-forwarded-for` or `cf-connecting-ip`? Depends on the operator's infrastructure. Default to `x-forwarded-for` with a comment explaining the override.
- Is the `NEXT_PUBLIC_API_URL` ARG also needed in a non-Docker deploy? It's already read from the environment at runtime by `getApiUrl()`; only the Dockerfile hardcoding is the problem.
