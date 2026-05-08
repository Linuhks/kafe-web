## Why

The Docker build fails in CI because `lib/api/generated/api.ts` is git-ignored and Orval requires a live backend (`localhost:3333`) to regenerate it — a backend that doesn't exist in the CI environment. Committing the OpenAPI spec as a static file allows CI to generate the client without a running backend.

## What Changes

- Add `openapi.json` to the repo root (saved from the backend's `/api/v1/docs-json` endpoint)
- Update `orval.config.ts` to use `./openapi.json` as input instead of the live URL
- Update `.github/workflows/ci.yaml` to install dependencies and run `pnpm generate:api` before the Docker build step
- Update `CLAUDE.md` to document how to refresh the spec when the backend API changes

## Capabilities

### New Capabilities

- `openapi-spec-management`: Versioned OpenAPI spec file as the source of truth for API client generation, enabling offline and CI generation without a live backend

### Modified Capabilities

- `ci-pipeline`: CI now includes a client generation step before Docker build

## Impact

- `orval.config.ts`: input source changes from HTTP URL to local file
- `.github/workflows/ci.yaml`: adds pnpm/node setup and `pnpm generate:api` step
- `openapi.json`: new file tracked in git
- `CLAUDE.md`: updated developer workflow documentation
- No runtime behavior changes — generated client is identical
