## 1. Instalação e Configuração Base

- [x] 1.1 Instalar `@playwright/test` como devDependency via `pnpm add -D @playwright/test`
- [x] 1.2 Criar `playwright.config.ts` na raiz com `testDir: './e2e'`, `webServer` apontando para `pnpm dev` (local) / `pnpm start` (CI), projetos Chromium e configurações de CI (`retries`, `trace`, `screenshot`)
- [x] 1.3 Criar o diretório `e2e/` com um teste de smoke básico (`e2e/smoke.spec.ts`) que navega para `/` e verifica que a página carrega
- [x] 1.4 Adicionar scripts `"test:e2e": "playwright test"` e `"test:e2e:ui": "playwright test --ui"` ao `package.json`

## 2. Gitignore e Higiene

- [x] 2.1 Adicionar `playwright-report/` e `test-results/` ao `.gitignore`

## 3. Integração com CI

- [x] 3.1 Adicionar step de `pnpm build` antes dos testes E2E no workflow do GitHub Actions (necessário para `pnpm start`)
- [x] 3.2 Adicionar step de cache dos browsers do Playwright no workflow (key baseada em `playwright --version` e OS)
- [x] 3.3 Adicionar step `npx playwright install --with-deps chromium` após restauração do cache
- [x] 3.4 Adicionar step `pnpm test:e2e` após a instalação dos browsers e antes do build Docker
- [x] 3.5 Adicionar step de upload de `playwright-report/` como artefato usando `if: failure()` para publicar apenas em caso de falha

## 4. Validação

- [x] 4.1 Executar `pnpm test:e2e` localmente e confirmar que o smoke test passa
- [x] 4.2 Confirmar que `playwright-report/` e `test-results/` não aparecem no `git status`
- [x] 4.3 Abrir um PR e verificar que o CI roda os testes E2E e bloqueia o pipeline em caso de falha
