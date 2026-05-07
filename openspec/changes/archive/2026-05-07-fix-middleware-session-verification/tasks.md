## 1. Atualizar proxy.ts

- [x] 1.1 Remover as funções `verifyAndDecodeJwt` e `getRoleFromToken` de `proxy.ts`
- [x] 1.2 Adicionar função `getSessionFromBackend(token: string): Promise<UserRole | null>` que chama `GET <API_URL>/api/auth/get-session` com `Authorization: Bearer <token>` e `signal: AbortSignal.timeout(3000)`, retornando `session.user.role` em caso de sucesso (status 200) ou `null` em caso de falha
- [x] 1.3 Substituir as chamadas a `getRoleFromToken(token)` no corpo da função `proxy` por `await getSessionFromBackend(token)`, mantendo toda a lógica de redirecionamento por role inalterada
- [x] 1.4 Remover a importação de `UserRole` se não for mais necessária, ou manter se ainda for usada no type do role

## 2. Verificar

- [x] 2.1 Testar login com conta ADMIN e confirmar acesso a `/admin/products` e `/admin/dashboard` sem redirect
- [x] 2.2 Testar login com conta CLIENT e confirmar acesso a `/orders/me` sem redirect
- [x] 2.3 Testar acesso sem cookie (aba anônima) a `/admin/products` e confirmar redirect para `/login`
- [x] 2.4 Confirmar que usuário ADMIN é redirecionado para `/admin/dashboard` ao acessar `/login` (lógica de redirect reverso)
