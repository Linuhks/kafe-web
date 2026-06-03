## Context

The catalog page UI was partially aligned with the Kafe design system in a prior pass, but several token and spacing mismatches remain relative to the finalized Stitch mockup. All changes are Tailwind class substitutions within existing components — no new dependencies, API calls, or state shape changes.

## Goals / Non-Goals

**Goals:**
- Close remaining visual gaps between current code and the Stitch `Kafe Menu (System Redesign)` screen
- Add the missing page footer to `app/cardapio/page.tsx`
- Update `catalog-page-ui` spec to reflect the tightened requirements

**Non-Goals:**
- Functional behaviour changes (add-to-cart, order flow, auth)
- New component extraction or abstraction
- Responsive breakpoint changes beyond what the Stitch design specifies

## Decisions

**Token alignment over custom values** — Replace ad-hoc tokens (`bg-card`, `bg-muted`, `bg-background`) with the canonical Kafe design-system tokens (`bg-surface-container-lowest`, `bg-secondary-container/20`, `bg-surface-container-low`). Using var(--kafe-*) CSS variables consistently means a single-source color update propagates everywhere.

**No CartSidebar width breaking change** — The sidebar expands from `max-w-sm` (384 px) to `max-w-md` (448 px). Both values are within the design-system range and don't require layout adjustments on the page itself.

**Footer in page, not layout** — The footer is catalog-specific (copyright, nav links), so it lives in `app/cardapio/page.tsx` rather than the shared layout. Adding it to the root layout would show it on admin/barista routes where it doesn't belong.

## Risks / Trade-offs

- **Unit test snapshots** — Class name changes will break any snapshot tests covering these components. Tests need updating; the fix is mechanical.
  → Update affected snapshot files as part of the same task.

- **Cart sidebar width on narrow viewports** — `max-w-md` fills the full screen at 375 px (the component already uses `w-full`), so no overflow risk.
  → No mitigation needed.

## Migration Plan

1. Edit component files (pure class substitution — no logic changes)
2. Add footer markup to `app/cardapio/page.tsx`
3. Run `pnpm test` and update any broken snapshots
4. Visual smoke-test in browser at `/cardapio`
