## Context

O botão CTA "Explorar Cardápio" em `app/page.tsx` é atualmente um `Button` com `asChild` renderizando um `Link` do Next.js. Por ser um Server Component puro, não há como adicionar estado local de loading. O usuário clica, não vê nenhuma resposta visual e espera o router processar a navegação — percepção de travamento.

## Goals / Non-Goals

**Goals:**
- Exibir feedback visual imediato (spinner + texto "Carregando…") ao clicar no botão antes do redirect completar.
- Manter `app/page.tsx` como Server Component.
- Reutilizar `Button`, ícones e estilos já existentes sem introduzir novas dependências.

**Non-Goals:**
- Prefetch ou otimização de carregamento da página `/cardapio`.
- Animações elaboradas (skeleton, progress bar, etc.).
- Afetar outros botões ou links da landing page.

## Decisions

### Extrair o CTA como Client Component

O botão precisa de `useState` para alternar entre o estado idle e loading. A menor unidade que requer `'use client'` é o próprio botão — extraí-lo para `components/landing/ExplorarCardapioButton.tsx` mantém toda a landing como Server Component e isola o estado no componente menor possível.

**Alternativa considerada**: converter `app/page.tsx` inteiro para Client Component — rejeitado porque adiciona overhead desnecessário e vai contra a convenção do projeto (Server Components por padrão).

### Usar `useRouter` + `useState` para o loading state

Ao clicar, `setLoading(true)` dispara imediatamente, exibindo o spinner. Em seguida, `router.push('/cardapio')` inicia a navegação. O estado de loading persiste até a desmontagem do componente (quando a página muda), sem necessidade de `setLoading(false)` explícito.

**Alternativa considerada**: manter `Link` e usar apenas CSS `active:` — rejeitado porque o estado `active` é efêmero demais (dura milissegundos) e não resolve o feedback durante a latência do redirect.

## Risks / Trade-offs

- **[Risco] Spinner persiste se navegação falhar** → O estado de loading fica preso caso `router.push` não complete. Mitigação: adicionar `setLoading(false)` no `catch` se futuramente a navegação puder falhar; por ora, `/cardapio` é uma rota estática sem risco de erro.
- **[Trade-off] Componente client mínimo** → Introduz um bundle JS pequeno na landing, mas é inevitável para qualquer interatividade.
