## Why

O projeto não possui testes de frontend automatizados, o que torna impossível verificar regressões visuais e de comportamento em componentes e fluxos de usuário. Playwright oferece testes E2E confiáveis e cross-browser integráveis ao CI existente.

## What Changes

- Instalação do `@playwright/test` como dev dependency
- Configuração do `playwright.config.ts` na raiz do projeto (Chromium apenas por padrão, Firefox/WebKit opcionais)
- Integração com o `webServer` do Next.js para subir o servidor antes dos testes
- Adição de scripts `test:e2e` e `test:e2e:ui` no `package.json`
- Diretório `e2e/` para os arquivos de teste
- Atualização do `.gitignore` para excluir artefatos do Playwright (`playwright-report/`, `test-results/`)
- Atualização do CI para rodar os testes E2E em cada PR

## Capabilities

### New Capabilities

- `playwright-setup`: Instalação, configuração e convenções de teste E2E com Playwright no projeto

### Modified Capabilities

- `ci-pipeline`: Adicionar step de testes E2E ao pipeline de CI existente

## Impact

- **Dependências**: `@playwright/test` (devDependency), binários de browser instalados via `npx playwright install`
- **CI**: O pipeline de CI (`.github/workflows/`) precisará instalar os browsers do Playwright e rodar `npm run test:e2e`
- **Arquivos novos**: `playwright.config.ts`, `e2e/` directory, atualização de `.gitignore`
- **package.json**: Novos scripts de teste
