## Context

O projeto não possui nenhuma camada de testes E2E. O frontend é Next.js 16/React 19 com TypeScript, usando pnpm e um pipeline de CI no GitHub Actions que já instala dependências, gera o cliente de API e constrói/pusha a imagem Docker. A adição de Playwright deve se encaixar nesse pipeline sem introduzir complexidade operacional excessiva.

## Goals / Non-Goals

**Goals:**
- Instalar e configurar `@playwright/test` com suporte a TypeScript
- Definir convenção de diretório e nomenclatura de testes (`e2e/`)
- Integrar o servidor Next.js ao runner via `webServer` config
- Adicionar scripts `test:e2e` e `test:e2e:ui` no `package.json`
- Rodar os testes E2E no CI antes do build Docker

**Non-Goals:**
- Escrever testes de aplicação (fora do escopo desta change — apenas a infraestrutura)
- Testes de componente isolado (`@playwright/experimental-ct-react`)
- Cobertura multi-browser em CI (Firefox/WebKit podem ser adicionados depois)
- Visual regression testing (Playwright Snapshots)

## Decisions

### 1. Diretório `e2e/` ao invés de `tests/`

`tests/` é o default do Playwright, mas pode colidir semanticamente com testes unitários. `e2e/` deixa explícita a intenção e segue convenção amplamente adotada em projetos Next.js.

### 2. Chromium apenas no CI

Rodar os três browsers (Chromium, Firefox, WebKit) em CI triplica o tempo de execução. O Chromium cobre a maioria dos casos relevantes para o projeto. Firefox e WebKit ficam disponíveis como projetos adicionais para serem habilitados sob demanda.

### 3. `webServer` com `pnpm dev` localmente, `pnpm start` no CI

Localmente, `reuseExistingServer: true` permite rodar contra um servidor já ativo (melhor DX). No CI não há servidor pré-existente, então o Playwright sobe o servidor com `pnpm start` (que requer build prévio). Alternativa de usar `pnpm dev` em CI foi descartada por ser mais lenta e menos representativa do ambiente de produção.

**Fluxo CI:**
1. `pnpm install --frozen-lockfile`
2. `pnpm generate:api`
3. `pnpm build`
4. `npx playwright install --with-deps chromium`
5. `pnpm test:e2e`
6. Upload de artefatos `playwright-report/` em caso de falha

### 4. Execução dos E2E antes do build Docker

Os testes E2E são um gate de qualidade — faz sentido rodá-los antes de criar e publicar a imagem. Se os testes falharem, não há build Docker.

### 5. `playwright.config.ts` na raiz

Padrão adotado pela maioria dos projetos Next.js. Mantém a configuração visível e facilita a integração com IDEs e ferramentas de CI.

## Risks / Trade-offs

- **Tempo de CI aumentado** → Mitigação: apenas Chromium no CI, testes rodam em paralelo (`fullyParallel: true`)
- **`pnpm build` obrigatório antes dos testes no CI** → Mitigação: o step de build já existia implicitamente via Docker; agora é explícito e reutilizável
- **Flakiness em testes E2E** → Mitigação: `retries: 2` no CI, `trace: 'on-first-retry'` para diagnóstico
- **Browsers do Playwright não cacheados por padrão** → Mitigação: usar `cache` do GitHub Actions com key baseada na versão do Playwright para evitar download a cada run
