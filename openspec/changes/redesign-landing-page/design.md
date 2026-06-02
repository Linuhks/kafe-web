## Context

The landing page (`app/page.tsx`) currently renders the correct structure — hero icon, headline, pills, CTA — but uses hardcoded hex values (`#FDF6EE`, `#6F4E37`, `#C4A265`) that are inconsistent with the Kafe design-system tokens. There are no entry animations and no "Nosso Cardápio" preview section.

The `ExplorarCardapioButton` is a separate Client Component that uses `router.push('/cardapio')` with a loading state, which must be preserved — the reference HTML uses a same-page `<a href="#menu">` anchor, but that prototype does not have a real `/cardapio` route.

## Goals / Non-Goals

**Goals:**
- Replace all hardcoded colors with `kafe-*` design tokens
- Add staggered `fade-in-up` CSS entrance animations to hero elements
- Add a "Nosso Cardápio" preview section anchored at `id="menu"` below the fold
- Align icon usage to Material Symbols (or inline SVG matching the design system)
- Keep `app/page.tsx` as a Server Component

**Non-Goals:**
- Replacing the `/cardapio` navigation with a same-page scroll — `router.push` is kept
- Populating "Nosso Cardápio" with real API data (placeholder cards only)
- Changing the `/cardapio` page itself

## Decisions

### 1 — Keep `ExplorarCardapioButton` as a separate Client Component
**Chosen:** retain the component.  
**Why:** `app/page.tsx` must remain a Server Component. The loading-state behavior (spinner + disabled) requires `useState` and `useRouter`, which mandate `'use client'`. Inlining it would force the whole page client-side.  
**Alternative considered:** Convert to a plain `<a href="/cardapio">` link and drop the component. Rejected because the loading feedback is a spec requirement in `explorar-cardapio-button`.

### 2 — Animations via a single CSS keyframe in `globals.css`
**Chosen:** define `@keyframes fadeInUp` once in `globals.css`, expose via a Tailwind custom utility `animate-fade-in-up`, and compose `animation-delay` inline on each element.  
**Why:** keeps animation logic out of JS (no framer-motion dependency), compatible with Server Components, and easy to disable in tests.  
**Alternative considered:** Framer Motion with `motion.div`. Rejected due to bundle weight and no other motion usage in the app.

### 3 — Icon: inline SVG coffee cup
**Chosen:** Use the same SVG path as the reference design (stroke-based coffee cup).  
**Why:** Material Symbols doesn't have a coffee-cup glyph matching the brand icon in the reference. The hero uses a decorative icon, not a functional one, so Material Symbols is not needed here.  
**Alternative:** `lucide-react` `<Coffee />` (current). Acceptable fallback if the SVG path feels inconsistent.

### 4 — "Nosso Cardápio" section with placeholder cards
**Chosen:** Add three static placeholder cards (Clássicos, Especiais, Acompanhamentos) using `kafe-surface-container-low` and `rounded-2xl` consistent with the design system.  
**Why:** Gives the CTA scroll anchor a real target without needing an API call on the landing page.

## Risks / Trade-offs

- **Keyframe animation flashes on hydration** → Mitigation: use `opacity-0` as the starting CSS state, animation fills `forwards`. No JS dependency means no hydration mismatch.
- **Design token mismatch with reference hex colors** → The reference uses `#5D4037` / `#6B4E3D`; Kafe design-system primary is `#553722`. Colors will be slightly different. This is intentional — we follow the token, not the exact prototype hex.
