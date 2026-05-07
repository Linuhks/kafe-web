## Context

O Orval gera automaticamente tipos TypeScript (`ProductResponseDto`, `CategoryResponseDto`, `OrderResponseDto`, etc.) a partir do esquema OpenAPI do backend em `lib/api/generated/api.ts`. Paralelamente, `lib/types/index.ts` define manualmente os mesmos conceitos (`Product`, `Category`, `Order`, etc.). Isso cria duas fontes de verdade: quando o backend muda, o Orval regenera os DTOs, mas os tipos manuais ficam desatualizados silenciosamente.

O sintoma mais visível está em `app/page.tsx`:
```ts
categories={(categoriesRes.data.data ?? []) as Category[]}
products={(productsRes.data.data ?? []) as Product[]}
```
Esses casts com `as` suprimem erros TypeScript que deveriam alertar sobre divergências entre o DTO real e o tipo manual.

## Goals / Non-Goals

**Goals:**
- Fazer `lib/types/index.ts` re-exportar os DTOs gerados como aliases amigáveis
- Remover os casts `as Product[]` e `as Category[]` em `app/page.tsx`
- Manter todos os imports existentes de `@/lib/types` funcionando sem alteração
- Garantir que o TypeScript passe sem erros após a mudança

**Non-Goals:**
- Alterar o arquivo gerado `lib/api/generated/api.ts` (nunca editar manualmente)
- Migrar componentes para importar diretamente de `@/lib/api/generated/api`
- Modificar `orval.config.ts` ou o fluxo de geração

## Decisions

### Decisão: Re-export com alias em `lib/types/index.ts`

Reescrever `lib/types/index.ts` para re-exportar os DTOs gerados com aliases de compatibilidade:

```ts
export type { ProductResponseDto as Product } from '@/lib/api/generated/api'
export type { CategoryResponseDto as Category } from '@/lib/api/generated/api'
// ...
```

**Alternativa considerada**: Remover `lib/types/index.ts` e atualizar todos os imports para `@/lib/api/generated/api`.
**Por que rejeitada**: Exige mudanças em muitos arquivos sem ganho de valor. A camada de re-export mantém backward compatibility e isola componentes de nomes de DTO verbosos.

### Decisão: Manter tipos utilitários em `lib/types/index.ts`

`UserRole` e `OrderStatus` são uniões de string (`'ADMIN' | 'BARISTA' | 'CLIENT'`) que podem não ter correspondência direta nos DTOs gerados (que usam objetos `const enum`). Esses tipos permanecem definidos localmente até verificação.

## Risks / Trade-offs

- [Risco] DTOs gerados podem ter campos a mais ou a menos que os tipos manuais → Mitigation: `pnpm build` revelará erros de tipo nos componentes; corrigir conforme necessário.
- [Risco] `UserResponseDtoRole` e `OrderStatus` do Orval podem ser `const enum` em vez de union type → Mitigation: verificar `lib/api/generated/api.ts` antes de re-exportar; manter definições locais se necessário.
