## ADDED Requirements

### Requirement: Container runtime environment variables are documented
The `.env.local.example` file SHALL document the environment variables required when running the Next.js app inside a container. These MUST include `HOSTNAME` (set to `0.0.0.0` so the server binds on all interfaces) and `PORT` (the port the server listens on, default `3000`).

#### Scenario: Container app binds on all interfaces
- **WHEN** the Docker container starts with `HOSTNAME=0.0.0.0` and `PORT=3000`
- **THEN** the Next.js standalone server listens on `0.0.0.0:3000` and is reachable from outside the container

#### Scenario: Container variables documented in example file
- **WHEN** a developer opens `.env.local.example`
- **THEN** `HOSTNAME` and `PORT` are listed with comments explaining they are used in container deployments
