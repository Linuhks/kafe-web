## 1. CSS Token & Utility Setup (`app/globals.css`)

- [x] 1.1 Add missing color entries to `@theme inline`: `--color-kafe-on-secondary-container`, `--color-kafe-secondary-fixed`, `--color-kafe-on-primary-fixed`, `--color-kafe-on-primary-fixed-variant`, `--color-kafe-surface-container-highest`, `--color-kafe-surface-dim`, `--color-kafe-error-container`, `--color-kafe-on-error`, `--color-kafe-on-error-container`, `--color-kafe-tertiary-fixed`, `--color-kafe-tertiary-fixed-dim`, `--color-kafe-on-tertiary-fixed`, `--color-kafe-on-tertiary-fixed-variant`
- [x] 1.2 Add spacing aliases to `@theme inline`: `--spacing-stack-sm`, `--spacing-stack-md`, `--spacing-stack-lg`, `--spacing-gutter-grid`, `--spacing-margin-page` (mapped to existing `--kafe-*` vars)
- [x] 1.3 Add six `@utility` typography classes: `text-display-hero` (120px/110%/800/-0.04em), `text-headline-lg` (32px/120%/700), `text-headline-md` (24px/130%/600), `text-body-lg` (18px/160%/400), `text-body-md` (16px/150%/400), `text-label-sm` (14px/100%/600/0.02em letter-spacing)

## 2. Font Setup (`app/layout.tsx`)

- [x] 2.1 Add `<link rel="preconnect" href="https://fonts.googleapis.com" />` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />` preconnect tags in `<head>`
- [x] 2.2 Add `<link>` for Material Symbols Outlined stylesheet (`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap`) in `<head>`
- [x] 2.3 Add a `<style>` block (or global CSS rule) setting `.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }` in `globals.css`

## 3. Page Rewrite (`app/test-components/page.tsx`)

- [x] 3.1 Replace all imports and existing JSX with the new page skeleton: sticky `<header>`, `<main>`, and `<footer>` structure using `kafe-` prefixed token classes
- [x] 3.2 Implement the **Header section** inside `<main>`: "Foundations" label, large "System" display heading, and description paragraph
- [x] 3.3 Implement the **Typography & Palette section**: 12-column grid with typography canvas (6 type specimens) on the left and 4 color swatches on the right
- [x] 3.4 Implement the **Interactive Elements section**: table with Variant / Normal / Hover / Disabled columns and rows for PRIMARY, OUTLINE, DESTRUCTIVE buttons
- [x] 3.5 Implement the **Order States section**: card showing Recebido, Em preparo (with animated pulse dot), Concluído, Cancelado badges
- [x] 3.6 Implement the **Form Inputs section**: card with underline-style email input and box-style textarea
- [x] 3.7 Implement the **Navigation Shells section**: 12-column grid with top-bar mockup (left, 8 cols) and sidebar mockup with nav items and checkout button (right, 4 cols)
- [x] 3.8 Implement the **Composite Cards section**: 3-column grid with Order card (Order #8842), Product card (Guatemalan Antigua with image), and Subscription card (The Ritualist, dark primary background)
- [x] 3.9 Implement the **Footer**: brand name + copyright on the left, four legal links on the right

## 4. Verify

- [x] 4.1 Run `pnpm dev` and open `/test-components` — confirm all six sections render without layout breaks and icons appear correctly
- [x] 4.2 Confirm no TypeScript errors (`pnpm build` or type-check passes)
