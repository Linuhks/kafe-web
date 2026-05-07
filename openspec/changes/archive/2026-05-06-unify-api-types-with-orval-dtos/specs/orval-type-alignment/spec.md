## ADDED Requirements

### Requirement: lib/types re-exports DTOs do Orval
`lib/types/index.ts` SHALL re-exportar os tipos gerados em `lib/api/generated/api.ts` como aliases curtos, sem definir tipos duplicados manualmente.

#### Scenario: Product vem do Orval
- **WHEN** um componente importa `Product` de `@/lib/types`
- **THEN** o tipo recebido é `ProductResponseDto` gerado pelo Orval

#### Scenario: Category vem do Orval
- **WHEN** um componente importa `Category` de `@/lib/types`
- **THEN** o tipo recebido é `CategoryResponseDto` gerado pelo Orval

#### Scenario: Order vem do Orval
- **WHEN** um componente importa `Order` de `@/lib/types`
- **THEN** o tipo recebido é `OrderResponseDto` gerado pelo Orval

### Requirement: Remoção de type casts inseguros em app/page.tsx
`app/page.tsx` SHALL atribuir diretamente os dados retornados pelo Orval sem usar casts `as Product[]` ou `as Category[]`.

#### Scenario: Dados do catálogo sem cast
- **WHEN** `categoriesControllerList()` retorna dados
- **THEN** o resultado é passado ao componente sem cast explícito e sem erros de TypeScript

### Requirement: Imports existentes de @/lib/types permanecem válidos
Todos os arquivos que importam de `@/lib/types` SHALL continuar compilando sem alteração de import após a mudança.

#### Scenario: Componente existente não muda import
- **WHEN** `ProductCard.tsx` importa `Product` de `@/lib/types`
- **THEN** o TypeScript resolve o tipo corretamente via re-export
