## 1. Verificação dos DTOs gerados

- [x] 1.1 Abrir `lib/api/generated/api.ts` e identificar os nomes exatos dos DTOs: `ProductResponseDto`, `CategoryResponseDto`, `OrderResponseDto`, `UserResponseDto`, `IngredientResponseDto`, `StockMovementResponseDto`
- [x] 1.2 Verificar se `UserResponseDtoRole` e o enum de status do pedido são union types ou `const enum` para decidir se precisam de alias ou redefinição local

## 2. Reescrever lib/types/index.ts

- [x] 2.1 Substituir as interfaces manuais por re-exports com alias dos DTOs do Orval (ex.: `export type { ProductResponseDto as Product } from '@/lib/api/generated/api'`)
- [x] 2.2 Manter `UserRole` e `OrderStatus` como definições locais se não houver DTO equivalente, ou re-exportar com alias se existirem

## 3. Remover casts inseguros

- [x] 3.1 Em `app/page.tsx`, remover os casts `as Category[]` e `as Product[]` aproveitando que os tipos agora são compatíveis

## 4. Validação

- [x] 4.1 Rodar `pnpm build` e confirmar que não há erros de TypeScript
- [x] 4.2 Testar a homepage (`/`) no browser: categorias e produtos devem carregar normalmente
- [x] 4.3 Testar o fluxo de login e a fila da barista para garantir que nenhum componente foi afetado indiretamente
