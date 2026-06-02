### Requirement: Multi-stage Dockerfile produces a minimal production image
The repository SHALL include a `Dockerfile` at the root that uses multi-stage builds. The final image MUST contain only the Next.js standalone server output, static assets, and the public directory — no source files, no development dependencies, and no build tooling.

#### Scenario: Image built successfully
- **WHEN** `docker build -t kafe-web .` is run from the repo root
- **THEN** the build completes without errors and an OCI image tagged `kafe-web` is produced

#### Scenario: Final image does not contain source files
- **WHEN** the built image is inspected
- **THEN** no `.ts`, `.tsx` source files exist inside the image and `node_modules` at the project root is absent

#### Scenario: Production server starts
- **WHEN** `docker run -p 3000:3000 kafe-web` is executed
- **THEN** the container starts and the Next.js app responds on port 3000

### Requirement: Container runs as a non-root user
The runner stage of the Dockerfile SHALL create a dedicated non-root user (`nextjs`, uid 1001) and the Node.js process MUST run as that user.

#### Scenario: Non-root process in running container
- **WHEN** `docker exec <container> whoami` is run against a live container
- **THEN** the output is `nextjs`, not `root`

### Requirement: .dockerignore excludes unnecessary paths
The repository SHALL include a `.dockerignore` file that excludes `node_modules`, `.next/cache`, `.git`, local env files, and any other paths not needed by the Docker build context.

#### Scenario: Build context is minimal
- **WHEN** `docker build` is run
- **THEN** `node_modules` and `.git` are not sent to the build daemon (no large-directory warnings)

### Requirement: Next.js standalone output mode is enabled
`next.config.ts` SHALL set `output: 'standalone'` so that `next build` produces a self-contained server bundle that the Dockerfile runner stage can copy without the full `node_modules` tree.

#### Scenario: Standalone output produced after build
- **WHEN** `pnpm build` is run locally
- **THEN** `.next/standalone/server.js` exists in the build output
