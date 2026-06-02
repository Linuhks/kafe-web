## Context

The kafe-web Next.js application has no container build definition. The project uses `pnpm` as its package manager and Next.js with TypeScript and Tailwind. The backend runs separately at `localhost:3333` and is not part of this image. The goal is to produce the smallest possible OCI image suitable for production deployment.

## Goals / Non-Goals

**Goals:**
- Multi-stage Dockerfile that produces a minimal production image
- Standalone Next.js output mode to avoid shipping unnecessary files
- Non-root runtime user for security hardening
- `.dockerignore` to minimize build context
- Document required container environment variables

**Non-Goals:**
- Docker Compose or orchestration configuration
- CI/CD pipeline integration
- Backend container or multi-container setup
- Kubernetes manifests or Helm charts

## Decisions

### Stage layout: deps → builder → runner

Three stages:
1. **deps** — installs only production + dev dependencies (needed for `next build`)
2. **builder** — runs `next build`; copies node_modules from deps stage
3. **runner** — copies only the standalone output + static assets; no source, no node_modules

Alternatives considered:
- Two stages (install+build, then copy): simpler but harder to cache dependency installs separately from source changes
- Four stages (separate prod deps): unnecessary because standalone output bundles its own minimal server deps

### Base image: `node:22-alpine`

Alpine gives the smallest base (~45 MB vs ~200 MB for debian-slim). Node 22 is the LTS version active at build time.

Alternative: `node:22-slim` — larger but avoids occasional Alpine musl compatibility issues. Chosen Alpine because Next.js + pnpm have no native modules that break under musl.

### Package manager: pnpm with `--frozen-lockfile`

Project already uses pnpm. `--frozen-lockfile` ensures reproducible installs in CI. Enable pnpm via `corepack enable` in the image rather than installing globally.

### `output: 'standalone'` in next.config.ts

Next.js standalone mode traces dependencies and emits a minimal `server.js` + the subset of `node_modules` it actually needs. The runner stage copies only:
- `.next/standalone/` → `/app/`
- `.next/static/` → `/app/.next/static/`
- `public/` → `/app/public/`

This drops image size from ~600 MB to ~120–150 MB for a typical Next.js app.

### Non-root user

Runner stage creates a `nextjs` user (uid 1001) and runs the process as that user. Required by most container security policies and reduces blast radius of any RCE vulnerability.

## Risks / Trade-offs

- **Standalone mode + dynamic imports**: Next.js standalone trace may miss lazily-imported modules. Mitigation: run `next build` and verify the output locally before shipping.
- **Alpine musl**: Unlikely to cause issues here since no native addons are used, but worth noting for future dependencies. Mitigation: switch to `node:22-slim` if a native addon is added.
- **Backend URL at build time**: The Next.js rewrite points to `http://localhost:3333` — this is fine for client-side calls at runtime but irrelevant at image build time. The image does not embed the backend URL in any `NEXT_PUBLIC_*` variable.
- **`output: 'standalone'` change**: This is additive — it does not change dev server behavior, only affects `next build` output. Existing deploys are unaffected until they opt into the new image.

## Migration Plan

1. Add `output: 'standalone'` to `next.config.ts`
2. Add `Dockerfile` and `.dockerignore` to repo root
3. Test locally: `docker build -t kafe-web . && docker run -p 3000:3000 kafe-web`
4. Verify the app loads and API calls succeed through the rewrite
5. No rollback needed — the change is purely additive
