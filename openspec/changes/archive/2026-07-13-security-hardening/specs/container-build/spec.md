## MODIFIED Requirements

### Requirement: Multi-stage Dockerfile produces a minimal production image
The repository SHALL include a `Dockerfile` at the root that uses multi-stage builds. The final image MUST contain only the Next.js standalone server output, static assets, and the public directory — no source files, no development dependencies, and no build tooling. The `NEXT_PUBLIC_API_URL` build-time variable SHALL be accepted as a Docker build argument (`ARG`) and MUST NOT be hardcoded as a static `ENV` value in the Dockerfile. If the argument is not supplied, the Next.js build falls back to `http://localhost:3333`.

#### Scenario: Image built successfully
- **WHEN** `docker build --build-arg NEXT_PUBLIC_API_URL=https://my-api.example.com -t kafe-web .` is run from the repo root
- **THEN** the build completes without errors and an OCI image tagged `kafe-web` is produced

#### Scenario: Final image does not contain source files
- **WHEN** the built image is inspected
- **THEN** no `.ts`, `.tsx` source files exist inside the image and `node_modules` at the project root is absent

#### Scenario: Production server starts
- **WHEN** `docker run -p 3000:3000 kafe-web` is executed
- **THEN** the container starts and the Next.js app responds on port 3000

#### Scenario: Production API URL is not hardcoded in Dockerfile
- **WHEN** the Dockerfile is read
- **THEN** no production URL appears as a static `ENV` value; `NEXT_PUBLIC_API_URL` is declared as `ARG` only

#### Scenario: Image layer history does not expose production URL
- **WHEN** `docker history kafe-web` is inspected after a build with `--build-arg NEXT_PUBLIC_API_URL=https://secret.example.com`
- **THEN** the URL does not appear as a plaintext string in any layer command (because it was a build ARG consumed before the final stage)
