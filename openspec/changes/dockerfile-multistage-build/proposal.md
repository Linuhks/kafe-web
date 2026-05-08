## Why

The frontend has no container build definition, making it impossible to deploy as an OCI image. A multi-stage Dockerfile minimizes the final image size by separating dependency installation, build compilation, and runtime stages, avoiding shipping dev-time tooling and source files to production.

## What Changes

- Add `Dockerfile` to the repo root with a multi-stage build (deps → builder → runner)
- Add `.dockerignore` to exclude `node_modules`, `.next/cache`, and other unnecessary paths from the build context
- Production image runs as a non-root user for security
- Standalone Next.js output mode enabled via `next.config.ts` to allow minimal runtime copying

## Capabilities

### New Capabilities

- `container-build`: Dockerfile + .dockerignore that produce a minimal production OCI image for the Next.js app

### Modified Capabilities

- `env-configuration`: Next.js standalone output requires `HOSTNAME=0.0.0.0` and `PORT` env vars to be documented

## Impact

- New files: `Dockerfile`, `.dockerignore`
- Modified: `next.config.ts` (add `output: 'standalone'`)
- Modified: `openspec/specs/env-configuration/spec.md` (document container env vars)
- No runtime behavior changes — only affects how the app is packaged and deployed
