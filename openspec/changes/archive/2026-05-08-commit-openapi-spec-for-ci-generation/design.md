## Context

Currently, Orval fetches the OpenAPI spec at generation time from a live backend (`http://localhost:3333/api/v1/docs-json`). The generated file (`lib/api/generated/api.ts`) is git-ignored, so it doesn't exist in the Docker build context on CI. The Next.js build fails because application code imports from that file.

The CI workflow already does a Docker build and push; it needs one additional step — API client generation — before the Docker build runs.

## Goals / Non-Goals

**Goals:**
- CI generates the API client without a running backend
- The OpenAPI spec is versioned in git alongside the code that depends on it
- Developer workflow for updating the spec is simple and documented

**Non-Goals:**
- Automatic spec sync from backend on every CI run
- Validating the spec against the live backend in CI
- Changing the generated client output format or structure

## Decisions

### Commit `openapi.json` as the Orval input source

**Decision:** Save the OpenAPI JSON to `openapi.json` at the repo root and point `orval.config.ts` to it.

**Rationale:** The spec is the source of truth for the client. Committing it makes the client generation reproducible without a live backend. The alternative — committing `api.ts` directly — commits a derived artifact, which is noisy in diffs and can silently diverge from the spec.

**Alternative considered:** Generate inside the Dockerfile by starting a backend container as a CI service. Rejected: too complex, requires backend image availability, and ties frontend CI to backend deployment.

### Add pnpm + node setup back to CI for the generate step

**Decision:** Re-add `pnpm/action-setup`, `actions/setup-node`, `pnpm install`, and `pnpm generate:api` to the workflow, before the Docker build step.

**Rationale:** Orval runs as a Node.js CLI tool. The generate step must happen in the runner environment (not inside Docker) so the output file is available in the build context when `docker/build-push-action` copies the workspace.

**Alternative considered:** Run generation inside the Dockerfile as an extra build stage. Rejected: would require the spec file anyway, and adds complexity to the image build without benefit.

## Risks / Trade-offs

- **Spec staleness** → The committed `openapi.json` can drift from the live backend. Mitigation: document the update workflow clearly in `CLAUDE.md`; the mismatch will surface as type errors when `pnpm generate:api` is run locally after a backend change.
- **CI time increase** → Adding `pnpm install` adds ~30–60s to the pipeline. Acceptable trade-off for correctness.

## Migration Plan

1. Fetch current spec from running backend and save as `openapi.json`
2. Update `orval.config.ts` input to `./openapi.json`
3. Verify local generation still works: `pnpm generate:api`
4. Update CI workflow with the new steps
5. Push — CI should now build successfully
