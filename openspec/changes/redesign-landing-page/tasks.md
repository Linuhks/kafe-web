## 1. Animação CSS

- [x] 1.1 Adicionar `@keyframes fadeInUp` em `app/globals.css` (opacity 0→1, translateY 20px→0)
- [x] 1.2 Definir utilitário Tailwind `animate-fade-in-up` no `tailwind.config.ts` (ou via `@layer utilities` no globals.css)

## 2. Landing Page — `app/page.tsx`

- [x] 2.1 Remover import de `lucide-react` (`Coffee`) e substituir pelo SVG inline da xícara
- [x] 2.2 Trocar `bg-[#FDF6EE]` por `bg-kafe-surface` no elemento raiz
- [x] 2.3 Trocar todas as cores hardcoded (`#6F4E37`, `#C4A265`, `#FDF6EE`) pelos tokens `kafe-*` correspondentes
- [x] 2.4 Adicionar `animate-fade-in-up` com `animationDelay` inline em cada bloco do hero (ícone, headline, descrição, pills, CTA)
- [x] 2.5 Adicionar seção `<section id="menu">` com título "Nosso Cardápio" e três cards placeholder (Clássicos, Especiais, Acompanhamentos) usando `bg-kafe-surface-container-low rounded-2xl`
- [x] 2.6 Atualizar link "Cardápio" no header para `href="#menu"` (scroll âncora) mantendo o `ExplorarCardapioButton` com `router.push('/cardapio')`

## 3. ExplorarCardapioButton — `components/landing/ExplorarCardapioButton.tsx`

- [x] 3.1 Trocar classes de cor hardcoded pelo par `bg-kafe-primary text-kafe-on-primary`
- [x] 3.2 Verificar que hover/focus states continuam usando tokens (`hover:bg-kafe-primary/90` ou equivalente)

## 4. Verificação

- [x] 4.1 Confirmar que `app/page.tsx` não tem diretiva `'use client'` (permanece Server Component)
- [x] 4.2 Rodar `npm run build` sem erros de tipo
- [x] 4.3 Verificar animações no browser (entrada escalonada visível, sem flash de conteúdo)
- [x] 4.4 Confirmar scroll suave ao clicar em "Cardápio" no nav (rola até `#menu`)
