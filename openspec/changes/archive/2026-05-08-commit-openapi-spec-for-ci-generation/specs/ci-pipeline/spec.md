## MODIFIED Requirements

### Requirement: API client is generated before Docker build
The pipeline SHALL run `pnpm generate:api` after installing dependencies and before building the Docker image, so the generated file is present in the build context.

#### Scenario: Client generation succeeds — pipeline continues to Docker build
- **WHEN** `pnpm generate:api` exits with code 0
- **THEN** the pipeline proceeds to the Docker build step with `lib/api/generated/api.ts` present

#### Scenario: Client generation fails — pipeline halts
- **WHEN** `pnpm generate:api` exits with a non-zero code
- **THEN** the pipeline fails and does not attempt to build or push an image

## REMOVED Requirements

### Requirement: Tests must pass before image is built
**Reason**: No test suite is configured; the `pnpm test` script ran `next lint` which was misconfigured. Tests are removed until a proper test suite is introduced.
**Migration**: Re-add a `pnpm test` step when a test suite is configured.
