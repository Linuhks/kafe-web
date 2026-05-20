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

### Requirement: Pipeline instala os browsers do Playwright antes dos testes E2E
O CI SHALL executar `npx playwright install --with-deps chromium` após o build da aplicação e antes dos testes E2E, com cache da instalação baseado na versão do Playwright.

#### Scenario: Browsers instalados com sucesso
- **WHEN** o step de instalação do Playwright roda
- **THEN** o binário do Chromium está disponível para o runner de testes

#### Scenario: Cache de browsers utilizado quando disponível
- **WHEN** a versão do Playwright não mudou desde a última execução
- **THEN** o GitHub Actions restaura os browsers do cache sem re-download

### Requirement: Pipeline executa testes E2E antes do build Docker
O CI SHALL rodar `pnpm test:e2e` após o build Next.js (`pnpm build`) e antes do build da imagem Docker; falha nos testes SHALL bloquear os steps subsequentes.

#### Scenario: Testes E2E passam — pipeline continua para Docker
- **WHEN** `pnpm test:e2e` sai com código 0
- **THEN** o pipeline prossegue para o build e push da imagem Docker

#### Scenario: Testes E2E falham — pipeline é bloqueado
- **WHEN** `pnpm test:e2e` sai com código diferente de 0
- **THEN** o pipeline falha e não executa o build ou push Docker

### Requirement: Relatório do Playwright publicado como artefato em caso de falha
O CI SHALL fazer upload de `playwright-report/` como artefato do workflow quando os testes E2E falharem.

#### Scenario: Artefato disponível após falha
- **WHEN** um ou mais testes E2E falham
- **THEN** `playwright-report/` é publicado como artefato do GitHub Actions e fica disponível por 30 dias

#### Scenario: Artefato não publicado em caso de sucesso
- **WHEN** todos os testes E2E passam
- **THEN** nenhum artefato de relatório é publicado para não poluir o histórico
