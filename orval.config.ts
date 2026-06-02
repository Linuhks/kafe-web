import { defineConfig } from 'orval';

// Run `pnpm generate:api` to regenerate whenever openapi.yaml changes.
// Generated files are in lib/api/generated/ (git-ignored).
export default defineConfig({
  kafe: {
    input: 'https://kafe-api-latest.onrender.com/api/v1/docs-json',
    output: {
      mode: 'single',
      target: 'lib/api/generated/api.ts',
      client: 'react-query',
      baseUrl: '',
      override: {
        mutator: {
          path: './lib/api/fetcher.ts',
          name: 'apiFetch',
        },
      },
    },
  },
});
