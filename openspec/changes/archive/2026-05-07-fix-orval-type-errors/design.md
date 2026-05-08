## Context

Após o `orval-type-alignment`, `lib/types/index.ts` re-exporta tipos gerados pelo Orval. Isso expôs 3 erros de TypeScript que impedem `pnpm build`:

1. `app/login/page.tsx:45` — `Property 'data' does not exist on type 'LoginResponseDto'`
2. `app/admin/products/[id]/edit/page.tsx:75` — `description` tipado como `{ [key: string]: unknown } | null`
3. `app/admin/products/[id]/edit/page.tsx:77` — `imageUrl` tipado como `{ [key: string]: unknown } | null`

O arquivo `lib/api/generated/api.ts` é gerado automaticamente e não deve ser editado.

## Goals / Non-Goals

**Goals:**
- `pnpm build` conclui sem erros de TypeScript
- Nenhuma mudança de comportamento em runtime
- Solução mínima — corrigir apenas o que está errado, sem refatorar

**Non-Goals:**
- Corrigir a geração do Orval na fonte (problema no schema do backend)
- Adicionar type guards genéricos para todos campos anuláveis
- Alterar como o backend serializa respostas

## Decisions

### Decisão 1: Login — corrigir o código, não o tipo

**Situação:** O tipo Orval diz `response.data: LoginResponseDto = { token, user }`. O código faz `const { data } = response.data` esperando um wrapper `{ data: LoginResponseDto }`.

O backend usa um interceptor global que envolve respostas em `{ data: ... }`. Para endpoints de listagem isso está refletido no tipo Orval (ex: `UsersControllerList200 = { data: UserResponseDto[], pagination }`). Para o login, o schema OpenAPI do backend não documenta o wrapper — o Orval gerou `LoginResponseDto` como corpo direto.

**Opções consideradas:**
- A) Mudar código para `const { token, user } = response.data` (assume que o tipo Orval está certo — sem wrapper)
- B) Manter `response.data.data` com type assertion `as unknown as { data: LoginResponseDto }` (assume que o servidor wrapa)
- C) Verificar comportamento real e corrigir conforme o runtime

**Escolha: A** — o tipo Orval é gerado do schema OpenAPI que é a fonte de verdade contratual. Se o Orval diz que `response.data` é `LoginResponseDto`, o código deve seguir isso. Se a resposta real vier embrulhada, o problema está no schema do backend (não documentar o wrapper), não no código frontend. Alinhar com o contrato exposto é mais correto do que acomodar um undocumented behavior.

### Decisão 2: Campos anuláveis — type assertion pontual no site de uso

**Situação:** `ProductResponseDtoDescription` e `ProductResponseDtoImageUrl` são `{ [key: string]: unknown } | null` no Orval gerado — deveria ser `string | null`. Isso é bug no schema do backend (`@nullable` sem tipo base explícito).

**Opções consideradas:**
- A) Cast `as string` no ponto de uso em `page.tsx`
- B) Criar tipos utilitários que corrigem `ProductResponseDto`
- C) Regenerar o Orval com o backend corrigido

**Escolha: A** — solução cirúrgica. Um cast pontual em 2 linhas é menos invasivo que criar tipos auxiliares. A correção real é no backend (B e C exigem mudança fora do escopo). Comentário indicando o motivo do cast evita que seja removido por acidente.

## Risks / Trade-offs

- [Risco] Decisão 1 pode estar errada se o servidor realmente wrapa a resposta do login → o login quebraria em runtime com `TypeError: Cannot destructure property 'token' of undefined`. **Mitigação**: testar o login manualmente após a mudança antes de considerar pronto.
- [Trade-off] Decisão 2 usa `as string` que silencia o TypeScript mas não valida runtime. Se o backend mandar um objeto em vez de string, a UI vai mostrar `[object Object]`. Aceitável dado que o bug está no schema, não no valor real retornado.
