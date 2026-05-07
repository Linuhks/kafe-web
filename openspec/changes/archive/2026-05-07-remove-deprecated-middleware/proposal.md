## Why

Next.js has deprecated the `middleware.ts` file convention in favor of `proxy.ts`. Having both files present causes an unhandled runtime error that crashes the dev server, and the `config` re-export from `middleware.ts` is silently ignored — meaning route matching falls back to defaults.

## What Changes

- **BREAKING** Delete `middleware.ts` (the deprecated re-export shim)
- `proxy.ts` becomes the sole route-guard entry point (it already contains the full implementation)

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `route-access-control`: The access-control enforcement mechanism now uses only `proxy.ts`; `middleware.ts` is removed. No requirement changes — same routes, same roles, same redirect logic.

## Impact

- `middleware.ts` deleted
- `proxy.ts` unchanged (already correct)
- No API, type, or component changes required
