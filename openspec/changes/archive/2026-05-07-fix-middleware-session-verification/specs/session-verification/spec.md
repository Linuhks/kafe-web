## ADDED Requirements

### Requirement: Middleware verifica sessão via backend
O middleware SHALL validar o `kafe_token` chamando `GET <API_URL>/api/auth/get-session` com `Authorization: Bearer <token>`. O role do usuário SHALL ser extraído de `session.user.role` na resposta. Se a chamada falhar ou retornar status diferente de 200, o middleware SHALL tratar o request como não autenticado (fail-closed).

#### Scenario: Session token válido retorna role correto
- **WHEN** o cookie `kafe_token` contém um session token válido emitido pelo better-auth
- **THEN** o middleware extrai `session.user.role` da resposta do backend e permite ou redireciona conforme o role

#### Scenario: Session token inválido ou expirado é rejeitado
- **WHEN** o cookie `kafe_token` contém um token que o backend não reconhece
- **THEN** o endpoint retorna status diferente de 200 e o middleware trata o request como não autenticado

#### Scenario: Backend indisponível causa fail-closed
- **WHEN** o fetch ao endpoint de sessão falha por erro de rede ou timeout (>3s)
- **THEN** o middleware trata o request como não autenticado e redireciona para `/login`

#### Scenario: Cookie ausente não dispara chamada ao backend
- **WHEN** o request chega sem o cookie `kafe_token`
- **THEN** o middleware trata o request como não autenticado sem fazer fetch ao backend
