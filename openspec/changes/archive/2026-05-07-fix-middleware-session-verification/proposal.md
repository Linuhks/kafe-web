## Why

O middleware (`proxy.ts`) foi implementado assumindo que o `kafe_token` é um JWT verificável com HMAC-SHA256, mas o backend usa `better-auth` com o plugin `bearer()`, que emite **session tokens opacos** — não JWTs. Como resultado, a verificação falha para 100% dos tokens válidos e todos os usuários autenticados são redirecionados para `/login` ao tentar acessar rotas protegidas.

## What Changes

- `proxy.ts`: remove a lógica de decodificação e verificação HMAC-SHA256 de JWT; substitui por chamada HTTP ao endpoint `GET /api/auth/get-session` do better-auth para validar o session token e obter o role do usuário
- `openspec/specs/proxy-convention/spec.md`: atualizar para refletir que a verificação de sessão é feita via backend (não localmente)
- `openspec/specs/jwt-verification/spec.md`: revogar — a premissa (token é JWT com HMAC-SHA256) é inválida; a spec não se aplica a tokens opacos do better-auth

## Capabilities

### New Capabilities

- `session-verification`: Verificação de sessão no middleware via chamada ao endpoint `GET /api/auth/get-session` do better-auth, usando o token do cookie `kafe_token` como Bearer token

### Modified Capabilities

- `proxy-convention`: O comportamento de proteção de rotas permanece o mesmo, mas o mecanismo de verificação do token muda de decodificação JWT local para validação via backend

## Impact

- `proxy.ts`: único arquivo alterado no frontend
- Sem mudanças no backend (o endpoint `/api/auth/get-session` já existe no better-auth)
- Latência adicional no middleware: 1 round-trip HTTP ao backend por request em rota protegida
- `JWT_SECRET` no `.env.local` torna-se desnecessário para o frontend
