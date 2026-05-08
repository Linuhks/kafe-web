## 1. Prerequisites

- [x] 1.1 Add `"test": "next lint"` to the `scripts` section in `package.json` so the pipeline has a command to run
- [x] 1.2 Confirm `Dockerfile` and `.dockerignore` are committed (they are currently untracked)

## 2. GitHub Actions Workflow

- [x] 2.1 Create `.github/workflows/ci.yaml` with a `build` job that triggers on push to `master`
- [x] 2.2 Add setup steps: `actions/checkout`, `pnpm/action-setup@v4` (version 10), `actions/setup-node@v6` (Node 25, pnpm cache)
- [x] 2.3 Add `pnpm install --frozen-lockfile` and `pnpm test` steps — pipeline must halt on test failure
- [x] 2.4 Add SHA tag generation step (first 7 chars of `GITHUB_SHA`) stored in step output
- [x] 2.5 Add `docker/login-action@v4` step using `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets
- [x] 2.6 Add `docker/build-push-action@v7` step that pushes `kafe-web:<sha>` and `kafe-web:latest`

## 3. Repository Configuration

- [x] 3.1 Set `DOCKERHUB_USERNAME` secret in GitHub repository settings
- [x] 3.2 Set `DOCKERHUB_TOKEN` secret in GitHub repository settings
