## Context

The application uses JWT tokens issued by the NestJS backend. Tokens are stored in an httpOnly cookie (`kafe_token`). The Next.js middleware (`proxy.ts`) reads this cookie and extracts the role to enforce route-level RBAC.

Currently, the middleware decodes the JWT payload via raw base64 without verifying the HMAC-SHA256 signature. This means any crafted token with an arbitrary role claim is accepted. The backend signs tokens with a secret (`JWT_SECRET`), which must also be available to the frontend middleware.

The fix is constrained to the Edge Runtime environment (no Node.js `crypto` module available), so verification must use the Web Crypto API (`globalThis.crypto.subtle`).

## Goals / Non-Goals

**Goals:**
- Reject JWTs with invalid or missing signatures before trusting the role claim
- Set a bounded session lifetime (8 hours) on the auth cookie
- Remove unbounded string inputs from forms that accept user content
- Suppress raw error objects from being shown to users
- Restrict image loading to a defined set of trusted hostnames

**Non-Goals:**
- Implementing token refresh or silent re-authentication
- Moving auth logic to the backend Next.js route handlers (cookies are already set there)
- Adding rate limiting (backend responsibility)
- Enforcing password complexity beyond current schema

## Decisions

### 1. Web Crypto API for JWT verification — no external library

**Decision**: Use `crypto.subtle.importKey` + `crypto.subtle.verify` directly rather than adding `jose` or `jsonwebtoken`.

**Rationale**: Edge Runtime supports the Web Crypto API natively. Adding a library for a single HMAC-SHA256 verify is unnecessary weight. The implementation is ~15 lines and has no transitive dependencies.

**Alternative considered**: `jose` library — supports Edge Runtime and is widely used, but adds a dependency and package surface area for a problem solvable with built-in APIs.

### 2. `maxAge: 28800` (8 hours) for the session cookie

**Decision**: 8-hour session lifetime aligns with a typical work shift for barista/admin roles.

**Alternative considered**: 24 hours — too long for shared devices; 1 hour — too short, forces re-login mid-shift.

### 3. `JWT_SECRET` in environment — not hardcoded

**Decision**: Read from `process.env.JWT_SECRET` in middleware; fail-closed (treat token as invalid) if the variable is absent.

**Rationale**: Secret must match the backend's `JWT_SECRET`. Fail-closed means a misconfigured deployment locks everyone out rather than letting attackers in — the safer failure mode.

### 4. Form input max-length via Zod `.max()` — no custom sanitization

**Decision**: Add `.max()` to Zod schemas at the form level. No additional sanitization (strip/escape) is applied client-side.

**Rationale**: The backend is responsible for persistence-level validation. Client-side `.max()` is a UX guard and an early rejection layer, not a security boundary. Adding sanitization on the frontend would be redundant with backend validation and could cause subtle data corruption.

### 5. Image domain allowlist defaults to `localhost` only in `next.config.ts`

**Decision**: Remove the `hostname: '**'` catch-all. Add only `localhost` for development. Production deployments must explicitly add their CDN hostname via the config.

**Alternative considered**: Reading allowed hostnames from an env var — adds complexity for a config value that changes rarely.

## Risks / Trade-offs

- **`JWT_SECRET` mismatch** → All users are logged out. Mitigation: document the required env var in `.env.example`; make the error message in middleware logs clear.
- **Edge Runtime Web Crypto API availability** → Available in all modern Next.js Edge environments; not a concern for the current stack.
- **8-hour session feels short for always-on barista tablets** → Acceptable trade-off; long-lived sessions can be revisited if it becomes an operational pain point.
- **`hostname: '**'` removal may break product images in dev** → Only breaks if product image URLs point to external hosts during development. `localhost` is explicitly allowed.

## Migration Plan

1. Add `JWT_SECRET` to `.env.local` (must match backend value)
2. Deploy frontend — middleware immediately starts verifying signatures
3. Existing valid tokens continue working; any forged tokens are rejected
4. No database migration needed; no rollback complexity

## Open Questions

- Should the image domain allowlist be driven by an environment variable to support multi-environment deployments without code changes?
