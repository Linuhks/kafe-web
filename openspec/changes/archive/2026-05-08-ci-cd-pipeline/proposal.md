## Why

kafe-web has no automated build or delivery pipeline. Every release requires a manual Docker build and push, which is error-prone and blocks continuous deployment. kafe-api already has a working CI pipeline — kafe-web should match it.

## What Changes

- Add `.github/workflows/ci.yaml` — GitHub Actions workflow that runs on every push to `master`
- Workflow installs deps, runs the test suite, builds a multi-stage Docker image, and pushes to Docker Hub with a short-SHA tag and `latest`
- The Dockerfile (already present and untracked) is committed as part of this change

## Capabilities

### New Capabilities
- `ci-pipeline`: GitHub Actions workflow that tests, builds, and pushes the Docker image on every push to master

### Modified Capabilities

## Impact

- New file: `.github/workflows/ci.yaml`
- Existing untracked files committed: `Dockerfile`, `.dockerignore`
- Requires `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets configured in the GitHub repository
- No application code changes
