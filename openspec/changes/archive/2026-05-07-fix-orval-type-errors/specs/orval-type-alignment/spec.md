## ADDED Requirements

### Requirement: Login page acessa token e user diretamente de response.data
`app/login/page.tsx` SHALL extrair `token` e `user` diretamente de `response.data` (tipo `LoginResponseDto`), sem acessar uma propriedade `.data` intermediária.

#### Scenario: Extração de token e user após login bem-sucedido
- **WHEN** `useAuthControllerLogin().mutateAsync()` retorna com `status === 200`
- **THEN** `token` e `user` são extraídos via `const { token, user } = response.data` sem erros de TypeScript

### Requirement: Campos anuláveis de ProductResponseDto são tratados como string | null nos sites de uso
Onde `product.description` ou `product.imageUrl` (tipados como `ProductResponseDtoDescription | ProductResponseDtoImageUrl`) são atribuídos a state de tipo `string`, o código SHALL usar type assertion `as string` com comentário explicativo.

#### Scenario: Inicialização do estado de edição de produto
- **WHEN** `app/admin/products/[id]/edit/page.tsx` inicializa `description` e `imageUrl` via `useState`
- **THEN** o código compila sem erros de TypeScript usando `product.description as string` e `product.imageUrl as string`
