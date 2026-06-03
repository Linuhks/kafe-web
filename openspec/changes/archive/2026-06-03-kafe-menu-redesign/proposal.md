## Why

The catalog page components were partially aligned with the Kafe design system but still use generic tokens (`bg-card`, `bg-muted`, `max-w-sm`) that diverge from the finalized Stitch mockup (project 8806313982556845188, screen `Kafe Menu (System Redesign)`). This pass closes the remaining visual gaps and adds the missing page footer.

## What Changes

- **`components/layout/NavBar.tsx`** — Increase header padding to `px-8 py-6`, logo size to `text-2xl`, remove outline variant from cart button (ghost style with primary text), use `bg-surface/95` backing color
- **`components/catalog/ProductCard.tsx`** — Switch card bg to `bg-surface-container-lowest border-outline-variant`, image bg to `bg-secondary-container/20`, inner padding to `p-6`, name to `text-xl font-bold`, remove `line-clamp-2` from description (full text, `leading-relaxed`)
- **`components/catalog/CartSidebar.tsx`** — Expand to `max-w-md`, bg to `bg-surface-container-lowest`, header/body padding to `p-8`, footer bg to `bg-surface-container-low` with `p-8`, total amount styled as `text-2xl font-extrabold text-[var(--kafe-primary)]`
- **`app/cardapio/page.tsx`** — Add a `<footer>` section matching the Stitch design (Kafe wordmark, copyright, Privacy/Terms/Contact links)

## Capabilities

### New Capabilities

*(none — all changes are refinements to existing capabilities)*

### Modified Capabilities

- `catalog-page-ui`: Tighten spacing/sizing requirements to match the finalized Stitch mockup — card bg tokens, image bg, inner padding, name weight, cart sidebar width and padding, footer presence

## Impact

- `components/catalog/ProductCard.tsx`, `CartSidebar.tsx` — visual-only token/spacing changes
- `components/layout/NavBar.tsx` — visual-only styling changes
- `app/cardapio/page.tsx` — add footer markup
- No API changes, no new dependencies
- Existing unit tests for `ProductCard`, `CartSidebar`, `NavBar` may need class-name snapshot updates
