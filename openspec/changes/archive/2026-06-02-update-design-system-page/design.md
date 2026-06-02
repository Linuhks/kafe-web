## Context

The project uses Tailwind 4 with all design tokens defined as CSS custom properties in `app/globals.css`. Color tokens live under the `kafe-` prefix (e.g., `--color-kafe-primary` → `bg-kafe-primary`). The reference design HTML was built with an isolated Tailwind CDN config that uses un-prefixed token names (`bg-primary`, `text-on-surface`). The project already has `--kafe-*` CSS vars for every color in the reference; many are missing from the `@theme inline` block, and spacing/typography scale tokens are not yet present as Tailwind utilities.

Plus Jakarta Sans is already loaded via `next/font/google` (`--font-jakarta` variable). Material Symbols Outlined is not present.

## Goals / Non-Goals

**Goals:**
- Full rewrite of `app/test-components/page.tsx` to match the reference design system page
- Add all missing color tokens to `@theme inline` so the page can use `bg-kafe-*` / `text-kafe-*` Tailwind utilities
- Add spacing aliases (`stack-sm`, `stack-md`, `stack-lg`, `gutter-grid`, `margin-page`) to `@theme inline`
- Add the six typography scale utilities as Tailwind `@utility` classes
- Add Material Symbols Outlined font link to `app/layout.tsx`

**Non-Goals:**
- Changing existing `kafe-` prefixed class usage anywhere else in the codebase
- Adding dark mode variants for the design system page
- Creating reusable React components for the cards/navigation shells shown on this page

## Decisions

### 1. Use `kafe-` prefixed classes throughout the page

The reference HTML uses un-prefixed token names (`bg-primary`, `text-on-surface`). The project's `@theme inline` block already maps `--color-primary` to shadcn/UI's oklch primary (not the Kafe coffee brown), so adopting unqualified `bg-primary` would silently pick up the wrong color. Using the `kafe-` prefix (`bg-kafe-primary`, `text-kafe-on-surface`) is unambiguous and consistent with every other page in the project.

### 2. Add missing `@theme inline` entries in `globals.css`

Several Kafe CSS vars exist in `:root` but are not registered as Tailwind utilities. Rather than using arbitrary value syntax (`bg-[#ffdad6]`), register the missing tokens once in `@theme inline`:
- Colors: `on-secondary-container`, `on-primary-fixed`, `on-primary-fixed-variant`, `error-container`, `on-error`, `on-error-container`, `surface-dim`, `tertiary-fixed`, `tertiary-fixed-dim`, `on-tertiary-fixed`, `on-tertiary-fixed-variant`, `secondary-fixed`, `surface-container-highest`
- These are added as `--color-kafe-<name>: var(--kafe-<name>)` entries.

### 3. Add spacing aliases to `@theme inline`

The reference uses shorthand spacing names. Add to `@theme inline`:
```css
--spacing-stack-sm: var(--kafe-stack-sm);
--spacing-stack-md: var(--kafe-stack-md);
--spacing-stack-lg: var(--kafe-stack-lg);
--spacing-gutter-grid: var(--kafe-gutter-grid);
--spacing-margin-page: var(--kafe-margin-page);
```
This enables `mb-stack-lg`, `gap-gutter-grid`, `px-margin-page`, etc. directly — consistent with how the existing `--spacing-kafe-*` tokens work.

### 4. Add typography scale as `@utility` classes

Tailwind 4's `--text-*` CSS variable support handles font size + line height but not font weight or letter spacing in a single token. The cleanest solution is six `@utility` classes defined in `globals.css`, each setting `font-size`, `line-height`, `font-weight`, and `letter-spacing` together. Class names mirror the reference: `text-display-hero`, `text-headline-lg`, `text-headline-md`, `text-body-lg`, `text-body-md`, `text-label-sm`. These are standalone utilities and do not conflict with existing `text-*` color utilities.

### 5. Material Symbols via `<link>` in layout

`next/font` does not support variable icon fonts. Add a standard Google Fonts `<link>` for Material Symbols Outlined in `app/layout.tsx` inside `<head>` as a regular preconnect + stylesheet link. This is the same pattern used for icon fonts elsewhere in the ecosystem.

## Risks / Trade-offs

- **[Spacing alias collision]** Adding `--spacing-stack-md` (without `kafe-` prefix) could theoretically collide with a future library. → Low risk: `stack-md`, `gutter-grid`, and `margin-page` are domain-specific names unlikely to be added by Tailwind core.
- **[Typography utilities and `text-*` colors]** Tailwind's `text-*` prefix is shared by color and size utilities. Adding `text-display-hero` as a utility that sets font-size won't conflict with colors (which use the color name like `text-primary`). → No conflict.
- **[Material Symbols font load]** Adding a Google Fonts `<link>` adds a network round-trip on first load for the icon font. → Acceptable for a dev/design-system page; not on the critical path for any user-facing route.
