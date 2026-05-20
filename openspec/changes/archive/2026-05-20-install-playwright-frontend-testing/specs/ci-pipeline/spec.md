## ADDED Requirements

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
