## Context

O middleware (`proxy.ts`) implementa proteção de rotas baseada em role. A implementação atual tenta verificar localmente o `kafe_token` como um JWT HMAC-SHA256. O backend usa `better-auth` com o plugin `bearer()`, que emite session tokens opacos armazenados no banco de dados — não JWTs. Consequentemente, `token.split('.')` nunca retorna 3 partes, a verificação retorna `null`, e todos os usuários autenticados são redirecionados para `/login`.

O better-auth expõe o endpoint `GET /api/auth/get-session` que valida o session token e retorna os dados da sessão (incluindo `user.role`) quando chamado com `Authorization: Bearer <token>`. Esse endpoint já existe no backend sem necessidade de mudanças.

## Goals / Non-Goals

**Goals:**
- Corrigir o middleware para verificar sessões via backend, obtendo o role corretamente
- Manter o comportamento de proteção de rotas (ADMIN, BARISTA, CLIENT) inalterado
- Eliminar a dependência de `JWT_SECRET` no frontend

**Non-Goals:**
- Adicionar cache de sessão no middleware (complexidade desnecessária agora)
- Modificar o backend
- Alterar o fluxo de login ou a forma como o cookie é setado
- Implementar token refresh

## Decisions

### 1. Verificar sessão via `GET /api/auth/get-session` com Bearer token

**Decision**: O middleware chama `http://localhost:3333/api/auth/get-session` (usando `process.env.API_URL ?? 'http://localhost:3333'`, consistente com o fetcher) passando o cookie `kafe_token` como `Authorization: Bearer <token>`. A resposta contém `session.user.role`.

**Rationale**: É o mecanismo correto para better-auth com tokens opacos. Não requer mudanças no backend. O endpoint já existe.

**Alternative considered**: Adicionar o plugin JWT do better-auth para emitir JWTs verificáveis localmente — descartado porque exige mudança no backend e perde a capacidade de invalidação imediata de sessão (importante para `ban/unban` do plugin `admin()`).

### 2. Remover toda a lógica de `verifyAndDecodeJwt`

**Decision**: Deletar as funções `verifyAndDecodeJwt` e `getRoleFromToken` inteiramente. A função `proxy` passa a chamar diretamente o endpoint de sessão.

**Rationale**: O código de verificação JWT é incorreto para este backend e não deve ser mantido como dead code ou fallback — induziria futuros mantenedores ao erro.

### 3. Timeout e falha fechada no fetch de sessão

**Decision**: Se o fetch ao backend falhar (network error, timeout, backend indisponível), o middleware trata o usuário como não autenticado (fail-closed). O middleware usa `signal: AbortSignal.timeout(3000)` para não bloquear requests indefinidamente.

**Rationale**: Consistente com o comportamento atual (falha → redirect /login). 3 segundos é generoso para uma chamada localhost; em produção o backend estará no mesmo datacenter.

### 4. Rotas públicas não chamam o backend

**Decision**: O matcher do `config` já exclui `_next/static`, `_next/image`, `favicon.ico` e assets. Além disso, `/login` e `/` não fazem fetch ao backend quando o token está ausente — o fetch só é executado se o cookie existir.

**Rationale**: Evita chamadas desnecessárias ao backend para visitantes anônimos.

## Risks / Trade-offs

- **Latência**: Cada request a rota protegida adiciona ~1 round-trip HTTP ao backend. Em desenvolvimento (localhost) isso é negligenciável (<5ms). Em produção, depende da latência de rede interna.
- **Disponibilidade do backend**: Se o backend cair, o middleware não consegue verificar sessões e redireciona todos para `/login` — comportamento fail-closed intencional.
- **`JWT_SECRET` no frontend torna-se inútil**: A variável pode ser removida do `.env.local` para evitar confusão futura.

## Migration Plan

1. Atualizar `proxy.ts` — remover `verifyAndDecodeJwt`/`getRoleFromToken`, adicionar `getSessionFromBackend`
2. Testar localmente: login com cada role e verificar acesso às rotas protegidas
3. Remover `JWT_SECRET` do `.env.local` (opcional, não quebra nada se mantido)
4. Sem necessidade de deploy coordenado com o backend

## Open Questions

- Quando este projeto for para produção, o `API_URL` env var precisará apontar para o backend real — já é o padrão do `fetcher.ts`, então o middleware seguirá a mesma convenção.
