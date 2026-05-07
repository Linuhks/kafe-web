## Context

Next.js introduced `proxy.ts` as the replacement for `middleware.ts`. The project already migrated the implementation to `proxy.ts`, but left a `middleware.ts` shim that re-exports from `proxy.ts`. Next.js now rejects having both files and throws an unhandled rejection at startup.

Current `middleware.ts`:
```ts
export { proxy as middleware, config } from './proxy'
```

This re-export was intended as a transitional bridge, but Next.js 16+ explicitly errors when both files exist, and it cannot detect the `config` export through re-exports anyway.

## Goals / Non-Goals

**Goals:**
- Eliminate the startup crash
- Leave `proxy.ts` as the single source of truth for request interception

**Non-Goals:**
- Modifying route-guard logic in `proxy.ts`
- Adding new protected routes
- Changing role-based redirect behavior

## Decisions

**Delete `middleware.ts` rather than rename/merge**: `proxy.ts` already contains the complete implementation. There is nothing in `middleware.ts` that isn't already in `proxy.ts` — it was only a re-export shim. Merging would add no value.

## Risks / Trade-offs

No risks. This is a file deletion with no logic changes.
