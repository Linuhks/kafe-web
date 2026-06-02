## Why

The current landing page (`app/page.tsx`) already has the right structure but uses hardcoded hex color values that don't align with the Kafe design-system tokens, and is missing the scroll-target "Nosso Cardápio" section and entry animations. The reference design provides a refined, animated version that should be adopted as the canonical starting experience.

## What Changes

- Replace hardcoded color values (`#FDF6EE`, `#6F4E37`, `#C4A265`) with Kafe design-system tokens (`kafe-surface`, `kafe-primary`, `kafe-secondary-container`)
- Add staggered `fade-in-up` entrance animations to hero elements (icon → headline → description → pills → CTA)
- Add a "Nosso Cardápio" section below the fold as the scroll target for the CTA button
- Replace the `lucide-react` `<Coffee />` icon with a Material Symbols or inline SVG consistent with the design system
- Update footer copy and structure to match the reference

## Capabilities

### New Capabilities

- `landing-page`: Public-facing hero page with animated entry, category pills, CTA scroll-link, and a menu-preview section

### Modified Capabilities

- `explorar-cardapio-button`: CTA button now lives inline in `app/page.tsx` rather than as a separate component; component may be folded back into the page or simplified

## Impact

- `app/page.tsx` — full rewrite of the landing page component
- `components/landing/ExplorarCardapioButton.tsx` — may be inlined or removed
- `app/globals.css` — needs `fade-in-up` keyframe animation
- No API or auth changes
