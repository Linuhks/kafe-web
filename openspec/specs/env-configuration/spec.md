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

### Requirement: Container runtime environment variables are documented
The `.env.local.example` file SHALL document the environment variables required when running the Next.js app inside a container. These MUST include `HOSTNAME` (set to `0.0.0.0` so the server binds on all interfaces) and `PORT` (the port the server listens on, default `3000`).

#### Scenario: Container app binds on all interfaces
- **WHEN** the Docker container starts with `HOSTNAME=0.0.0.0` and `PORT=3000`
- **THEN** the Next.js standalone server listens on `0.0.0.0:3000` and is reachable from outside the container

#### Scenario: Container variables documented in example file
- **WHEN** a developer opens `.env.local.example`
- **THEN** `HOSTNAME` and `PORT` are listed with comments explaining they are used in container deployments
