## 1. Update Orval Configuration

- [x] 1.1 Change `orval.config.ts` input to the deployed backend URL (`https://kafe-api-latest.onrender.com/api/v1/docs-json`)
- [x] 1.2 Run `pnpm generate:api` locally and confirm `lib/api/generated/api.ts` is generated without errors

## 2. Update CI Workflow

- [x] 2.1 Add `pnpm/action-setup@v4` (version 10) step after checkout in `.github/workflows/ci.yaml`
- [x] 2.2 Add `actions/setup-node@v6` (node-version 22, cache pnpm) step
- [x] 2.3 Add `pnpm install --frozen-lockfile` step
- [x] 2.4 Add `pnpm generate:api` step
- [x] 2.5 Confirm these steps appear before the "Generate tag" step

## 3. Update Documentation

- [x] 3.1 Update `CLAUDE.md` to reflect that `generate:api` fetches from the deployed backend
