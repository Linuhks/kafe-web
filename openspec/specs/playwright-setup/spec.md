## Requirements

### Requirement: Playwright instalado como dev dependency
O projeto SHALL ter `@playwright/test` instalado como `devDependency` via pnpm.

#### Scenario: Dependência presente no lockfile
- **WHEN** `pnpm install` é executado em um ambiente limpo
- **THEN** `@playwright/test` está disponível e o comando `npx playwright --version` retorna a versão instalada

### Requirement: Arquivo de configuração playwright.config.ts na raiz
O projeto SHALL ter um `playwright.config.ts` na raiz definindo `testDir`, `webServer`, `projects` e comportamentos de CI.

#### Scenario: Configuração válida reconhecida pelo runner
- **WHEN** `pnpm test:e2e` é executado
- **THEN** o Playwright lê `playwright.config.ts` sem erros de configuração e usa as definições do arquivo

#### Scenario: Base URL configurada corretamente
- **WHEN** um teste usa `await page.goto('/')`
- **THEN** a navegação ocorre para `http://localhost:3000/`

### Requirement: Diretório e2e/ como localização dos testes
Todos os arquivos de teste E2E SHALL estar em `e2e/` e seguir o padrão de nomenclatura `*.spec.ts`.

#### Scenario: Arquivo de teste reconhecido pelo runner
- **WHEN** um arquivo `e2e/example.spec.ts` existe
- **THEN** `pnpm test:e2e` o descobre e executa

#### Scenario: Arquivos fora de e2e/ ignorados
- **WHEN** um arquivo `.spec.ts` existe fora do diretório `e2e/`
- **THEN** `pnpm test:e2e` não o executa

### Requirement: Scripts npm para execução dos testes
O `package.json` SHALL expor `test:e2e` (headless) e `test:e2e:ui` (com interface Playwright UI).

#### Scenario: Execução headless
- **WHEN** `pnpm test:e2e` é executado
- **THEN** os testes rodam em modo headless e imprimem resultado no terminal

#### Scenario: Execução com UI
- **WHEN** `pnpm test:e2e:ui` é executado
- **THEN** a interface gráfica do Playwright abre para inspeção interativa dos testes

### Requirement: Artefatos do Playwright excluídos do controle de versão
Os diretórios `playwright-report/` e `test-results/` SHALL estar listados no `.gitignore`.

#### Scenario: Relatórios não commitados acidentalmente
- **WHEN** `git status` é executado após uma execução dos testes
- **THEN** `playwright-report/` e `test-results/` não aparecem como arquivos não rastreados

### Requirement: webServer inicia o servidor Next.js automaticamente
O Playwright SHALL iniciar o servidor Next.js antes dos testes e aguardar estar disponível em `http://localhost:3000`.

#### Scenario: Servidor iniciado automaticamente (sem servidor existente)
- **WHEN** não há servidor rodando na porta 3000 e `pnpm test:e2e` é executado
- **THEN** o Playwright inicia o servidor e aguarda disponibilidade antes de rodar os testes

#### Scenario: Servidor existente reutilizado localmente
- **WHEN** já há um servidor Next.js na porta 3000 e `pnpm test:e2e` é executado localmente
- **THEN** o Playwright reutiliza o servidor existente sem tentar subir um novo
