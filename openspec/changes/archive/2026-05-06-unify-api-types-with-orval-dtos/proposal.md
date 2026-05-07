## Why

Orval já está configurado e gera tipos TypeScript a partir do esquema OpenAPI do backend, mas os componentes ainda usam tipos definidos manualmente em `lib/types/index.ts`. Isso força casts explícitos (`as Product[]`, `as Category[]`) em `app/page.tsx` e mantém duas fontes de verdade paralelas para os mesmos tipos, anulando o principal benefício do Orval.

## What Changes

- Remover `lib/types/index.ts` e substituir por re-exports dos DTOs gerados pelo Orval (ex.: `ProductResponseDto`, `CategoryResponseDto`, `OrderResponseDto`)
- Eliminar os casts `as Product[]` e `as Category[]` em `app/page.tsx`
- Atualizar `components/catalog/ProductCard.tsx` (e quaisquer outros componentes que importam de `lib/types`) para usar os tipos re-exportados
- Manter aliases amigáveis opcionais (`Product = ProductResponseDto`) para não quebrar os imports existentes nos componentes

## Capabilities

### New Capabilities
- `orval-type-alignment`: Unificação dos tipos da aplicação com os DTOs gerados pelo Orval, tornando `lib/types/index.ts` um re-export dos tipos gerados em vez de definições manuais.

### Modified Capabilities

## Impact

- `lib/types/index.ts` — reescrito como re-exports dos DTOs gerados
- `lib/api/generated/api.ts` — somente leitura (gerado); nenhuma alteração direta
- `app/page.tsx` — remoção dos casts `as Product[]` / `as Category[]`
- `components/catalog/ProductCard.tsx` — nenhuma mudança de import necessária se os aliases forem mantidos
- Todos os arquivos que importam de `@/lib/types` continuam funcionando sem alteração de import
