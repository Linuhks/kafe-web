## Context

kafe-api already ships a GitHub Actions pipeline that installs with pnpm, runs tests, and builds/pushes a Docker image to Docker Hub. kafe-web has a Dockerfile (multi-stage, Node 22 alpine) committed as an untracked file but no workflow. The goal is to give kafe-web the same automated delivery path.

## Goals / Non-Goals

**Goals:**
- Run `pnpm test` on every push to master and fail fast if tests break
- Build the Docker image using the existing multi-stage Dockerfile
- Push two tags to Docker Hub: `<sha>` (7-char) and `latest`
- Keep the workflow consistent with kafe-api for maintainability

**Non-Goals:**
- PRs or branch builds — master-only, same as kafe-api
- Staging/production environment deploys — out of scope
- Changing the Dockerfile or application code

## Decisions

**Use the same toolchain versions as kafe-api (pnpm 10, Node 25)**
The Dockerfile already pins Node 22 alpine for the runtime image; the build environment (GH Actions runner) should use Node 25 to match kafe-api and keep CI environments consistent across both repos. These are independent concerns.

**Tag strategy: short SHA + `latest`**
Matches kafe-api exactly. The short SHA provides a stable, immutable reference per commit; `latest` lets downstream services pull the most recent build without pinning a tag.

**Use `docker/build-push-action` and `docker/login-action`**
Same as kafe-api — the Docker-maintained actions handle caching and multi-platform concerns with minimal configuration.

**Commit Dockerfile and .dockerignore as part of this change**
They already exist on disk as untracked files. They belong in the same commit as the workflow to keep the pipeline self-contained.

## Risks / Trade-offs

[No test suite yet] → The workflow runs `pnpm test` which will fail if no test script exists. Mitigation: verify `package.json` has a `test` script before merging.

[Secrets required] → `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` must be set in GitHub repo settings before the first push. Mitigation: document this in tasks.

[`latest` tag races on concurrent pushes] → Two quick pushes to master could result in `latest` pointing to the older image. Accepted risk — same trade-off as kafe-api.
