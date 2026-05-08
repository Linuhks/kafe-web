## ADDED Requirements

### Requirement: OpenAPI spec is committed to the repository
The project SHALL maintain a committed `openapi.json` file at the repo root containing the OpenAPI spec exported from the backend.

#### Scenario: Spec file exists in repository
- **WHEN** a developer clones the repository
- **THEN** `openapi.json` is present at the root and Orval can generate the API client without a running backend

### Requirement: Orval uses the committed spec file as input
The Orval configuration SHALL reference `./openapi.json` as its input source instead of the live backend URL.

#### Scenario: Client generation without backend
- **WHEN** a developer runs `pnpm generate:api` with no backend running
- **THEN** Orval reads `./openapi.json` and generates `lib/api/generated/api.ts` successfully

### Requirement: Spec update workflow is documented
The `CLAUDE.md` SHALL document how to refresh `openapi.json` when the backend API changes.

#### Scenario: Developer knows how to update the spec
- **WHEN** the backend API changes
- **THEN** the developer can follow documented steps to fetch the new spec and commit it
