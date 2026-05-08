## Requirements

### Requirement: Pipeline triggers on master push
The CI workflow SHALL run automatically on every push to the `master` branch.

#### Scenario: Push to master triggers workflow
- **WHEN** a commit is pushed to the `master` branch
- **THEN** the GitHub Actions workflow starts within 60 seconds

### Requirement: Dependencies are installed
The pipeline SHALL install project dependencies using pnpm with a frozen lockfile to ensure reproducible builds.

#### Scenario: Clean install succeeds
- **WHEN** the pipeline starts
- **THEN** `pnpm install --frozen-lockfile` completes without error

### Requirement: API client is generated before Docker build
The pipeline SHALL run `pnpm generate:api` after installing dependencies and before building the Docker image, so the generated file is present in the build context.

#### Scenario: Client generation succeeds — pipeline continues to Docker build
- **WHEN** `pnpm generate:api` exits with code 0
- **THEN** the pipeline proceeds to the Docker build step with `lib/api/generated/api.ts` present

#### Scenario: Client generation fails — pipeline halts
- **WHEN** `pnpm generate:api` exits with a non-zero code
- **THEN** the pipeline fails and does not attempt to build or push an image

### Requirement: Docker image is built and pushed
The pipeline SHALL build the Docker image using the multi-stage Dockerfile and push it to Docker Hub.

#### Scenario: Successful build and push
- **WHEN** tests pass and Docker Hub credentials are available
- **THEN** the image is pushed with two tags: `<DOCKERHUB_USERNAME>/kafe-web:<7-char-sha>` and `<DOCKERHUB_USERNAME>/kafe-web:latest`

### Requirement: Image tags identify the source commit
Each pushed image SHALL be tagged with the first 7 characters of the triggering commit's SHA.

#### Scenario: Tag generation
- **WHEN** the pipeline runs for commit `abc1234def5`
- **THEN** the image is tagged `kafe-web:abc1234`
