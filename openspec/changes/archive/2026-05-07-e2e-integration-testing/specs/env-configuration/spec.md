## ADDED Requirements

### Requirement: Environment variable template exists at repo root
The repository SHALL include a `.env.local.example` file at the root documenting all environment variables required to run the Next.js frontend. The file MUST use placeholder values (not real secrets) and MUST be committed to version control.

#### Scenario: New contributor setup
- **WHEN** a developer clones the repository and copies `.env.local.example` to `.env.local`
- **THEN** the dev server starts without missing-variable errors

#### Scenario: Required variable documented
- **WHEN** the frontend requires an environment variable at runtime
- **THEN** that variable MUST appear in `.env.local.example` with a descriptive comment and placeholder value

### Requirement: NEXT_PUBLIC_API_URL is the only required public variable
The frontend SHALL resolve API calls through the Next.js rewrite (`/api/v1/*` → `http://localhost:3333/api/v1/*`) so that `NEXT_PUBLIC_API_URL` is not needed at runtime. The `.env.local.example` MUST include it as an optional comment if developers want to override the backend URL.

#### Scenario: Default API routing without env var
- **WHEN** `NEXT_PUBLIC_API_URL` is not set
- **THEN** all API calls route through the built-in Next.js rewrite and succeed against a local backend
