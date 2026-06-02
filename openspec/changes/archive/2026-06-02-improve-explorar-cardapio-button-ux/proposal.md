## Why

O botão "Explorar Cardápio" na landing page não dá feedback visual ao clique — o usuário toca/clica e não percebe nenhuma resposta imediata, enquanto espera o redirect para `/cardapio`. A experiência fica travada e sem responsividade, especialmente em conexões lentas ou dispositivos móveis.

## What Changes

- O botão CTA na `app/page.tsx` passa a exibir estado de loading (spinner + texto "Carregando…") imediatamente após o clique, enquanto a navegação para `/cardapio` ocorre em background.
- O botão é extraído para um Client Component (`ExplorarCardapioButton`) para suportar estado interativo (`useState`, `useRouter`).
- A landing page (`app/page.tsx`) permanece Server Component — apenas o botão CTA é isolado como Client Component.

## Capabilities

### New Capabilities

- `explorar-cardapio-button`: Botão CTA com estado de loading imediato no clique antes do redirect para `/cardapio`.

### Modified Capabilities

<!-- Nenhuma especificação existente muda de requisito. -->

## Impact

- `app/page.tsx`: importa o novo `ExplorarCardapioButton` no lugar do bloco `Button asChild Link`.
- `components/landing/ExplorarCardapioButton.tsx`: novo Client Component criado.
- Sem novas dependências externas — usa `useRouter` (Next.js), `useState` (React) e os primitivos `Button` e ícones já existentes.
