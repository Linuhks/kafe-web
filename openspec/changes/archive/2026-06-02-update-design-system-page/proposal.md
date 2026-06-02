## Why

The current `app/test-components/page.tsx` is a bare-bones component playground with no visual coherence. The new design system HTML defines a comprehensive, brand-accurate showcase page that documents Kafe's full design language — typography, color tokens, interactive element states, order statuses, navigation patterns, and composite cards — giving the team a single reference for visual standards.

## What Changes

- Replace `app/test-components/page.tsx` with the new design system showcase page
- Add a sticky `TopNavBar` section header and a `Footer` section to the page
- Add Material Symbols Outlined icon font (Google Fonts) to the global layout
- Add Plus Jakarta Sans font to the global layout (if not already present)
- Ensure Tailwind config includes all required design tokens: extended colors, spacing aliases (`stack-md`, `stack-lg`, `margin-page`, `gutter-grid`), font-size scales (`display-hero`, `headline-lg`, `headline-md`, `body-lg`, `body-md`, `label-sm`), and border-radius tokens
- Remove current imports (`Button`, `Input`, `Badge`, `Skeleton`, `Dialog`, `Select`, `Toaster`, `PaginationWithSuspense`, `ToastDemo`) — page becomes a pure static Server Component
- Five showcase sections: Typography & Palette, Interactive Elements, Order States + Form Inputs, Navigation Shells, Composite Cards

## Capabilities

### New Capabilities

- `design-system-page`: Static design system documentation page at `/test-components` covering the full Kafe visual language

### Modified Capabilities

<!-- No existing spec-level behavior changes -->

## Impact

- Modified: `app/test-components/page.tsx` (full rewrite)
- Modified: `app/layout.tsx` — add Material Symbols Outlined + ensure Plus Jakarta Sans font links
- Modified: `tailwind.config.ts` (or `app/globals.css`) — add extended color tokens, spacing aliases, and typography scale
- Removed: dependency on `@/components/ui/*` imports from this page
- No API or auth changes
