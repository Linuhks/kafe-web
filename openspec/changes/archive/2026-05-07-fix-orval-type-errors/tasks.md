## 1. Corrigir login page

- [ ] 1.1 Em `app/login/page.tsx`, substituir `const { data } = response.data` + `const { token, user } = data` por `const { token, user } = response.data` (alinhar com o tipo Orval `LoginResponseDto`)
- [ ] 1.2 Remover o cast `user.role as UserRole` em `router.push(dashboardForRole(...))` pois `user.role` já é `UserResponseDtoRole` (= `UserRole`)
- [ ] 1.3 Testar o login manualmente no browser para confirmar que token e user chegam corretamente

## 2. Corrigir product edit page

- [ ] 2.1 Em `app/admin/products/[id]/edit/page.tsx`, no `useEffect` de inicialização, adicionar `as string` em `product.description` e `product.imageUrl` com comentário `// Orval gera { [key: string]: unknown } | null para campos @nullable sem tipo base explícito`
- [ ] 2.2 Verificar se há outros locais no mesmo arquivo que acessam `description` ou `imageUrl` e precisam do mesmo tratamento

## 3. Verificar build

- [ ] 3.1 Rodar `pnpm tsc --noEmit` e confirmar que os 3 erros foram resolvidos sem introduzir novos
- [ ] 3.2 Rodar `pnpm build` e confirmar que conclui com sucesso
