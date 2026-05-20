## 1. Client Component do botão CTA

- [x] 1.1 Criar `components/landing/ExplorarCardapioButton.tsx` com `'use client'`, `useState(false)` para loading, `useRouter` para navegação, e renderizar o `Button` com spinner (quando loading) ou `ArrowRight` (quando idle)
- [x] 1.2 Desabilitar o botão (`disabled`) quando `loading === true` para evitar cliques duplos

## 2. Integração na landing page

- [x] 2.1 Substituir o bloco `<Button asChild>…<Link href="/cardapio">…</Link></Button>` em `app/page.tsx` pelo novo `<ExplorarCardapioButton />`
