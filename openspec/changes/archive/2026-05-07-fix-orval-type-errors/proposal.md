## Why

O alinhamento de tipos do Orval (`orval-type-alignment`) expôs 3 erros de TypeScript que impedem `pnpm build` de concluir. Os erros existiam antes mas eram mascarados por tipos manuais soltos; agora com re-exports diretos do Orval o compilador os detecta corretamente.

## What Changes

- Corrigir acesso a `response.data.data` no login page — o tipo Orval diz que `response.data` é `LoginResponseDto` diretamente, mas o código assume um wrapper `{ data: LoginResponseDto }`; alinhar o código com o tipo real verificando o comportamento do backend
- Corrigir os tipos de `description` e `imageUrl` em `ProductResponseDto` — Orval gerou `{ [key: string]: unknown } | null` para esses campos anuláveis em vez de `string | null`; adicionar type assertions nos pontos de uso para preservar compatibilidade com o arquivo gerado (não editável)

## Capabilities

### New Capabilities

*(nenhuma — apenas correções)*

### Modified Capabilities

- `orval-type-alignment`: os requisitos de acesso a dados do login e dos campos anuláveis de produto precisam de ajuste para refletir os tipos Orval corretos

## Impact

- `app/login/page.tsx` — lógica de extração de `token` e `user` da resposta
- `app/admin/products/[id]/edit/page.tsx` — inicialização de estado com `description` e `imageUrl`
- `pnpm build` passa a concluir sem erros
- Nenhuma mudança de comportamento em runtime — os valores já estavam corretos
