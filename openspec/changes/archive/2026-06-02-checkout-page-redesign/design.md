## Context

The checkout flow currently lives in a modal component. The design reference (provided HTML mockup) defines a two-column full-page layout matching Kafe's Material-You design system (`kafe-*` Tailwind tokens). The project uses Next.js App Router with Server Components by default; the checkout form needs interactivity so the page component must be a Client Component.

The design system tokens are defined in `tailwind.config.ts` under the `kafe-` prefix. The `app/test-components/page.tsx` serves as the living reference for correct token usage. All new components must follow those patterns.

## Goals / Non-Goals

**Goals:**
- Full-page `/checkout` route with numbered form sections and sticky order summary sidebar
- Reusable `TopNavBar` and `Footer` components extracted as shared layout primitives
- Pixel-faithful translation of the HTML mockup to the `kafe-*` design system tokens
- Components ready to drop into any page via import (no global layout wrapping)

**Non-Goals:**
- Actual form submission or API integration (UI-only at this stage)
- Cart state management or real item data (static demo items are acceptable)
- Mobile hamburger menu for the nav (hidden on mobile like the existing design system header)
- Dark mode variant

## Decisions

**Client Component for checkout page**
The checkout form needs `useState` for input focus effects and future form handling. The page will have `'use client'` at the top. Order summary sidebar is static so it could be a Server Component, but co-locating everything in one client page avoids over-engineering a one-shot UI.

**Separate `TopNavBar` and `Footer` components, not a Layout wrapper**
The user explicitly asked for them to be separate so they can be added to other pages individually. A shared layout file (`app/layout.tsx`) would apply globally — too broad. Named exports from `components/layout/` gives full control per-page.

**`kafe-*` token prefix over bare color names**
The design system uses `kafe-primary`, `kafe-on-surface`, etc. The HTML mockup uses bare names (`primary`, `on-surface`) from a local Tailwind config. All translation to the Next.js project MUST use the `kafe-` prefixed tokens to match the existing codebase convention.

**Static cart items in order summary**
No cart store exists yet. The order summary renders static demo items matching the mockup. This is intentional — cart state is a separate future capability.

## Risks / Trade-offs

- **Token mismatch** → Mitigation: Cross-reference every color/spacing class against `app/test-components/page.tsx` before finalizing
- **Form focus effects require JS** → Mitigation: Use Tailwind `focus:` variants instead of inline JS event listeners (the HTML mockup used JS; Tailwind handles this declaratively)
- **Sticky sidebar z-index conflict with nav** → Mitigation: Nav uses `z-50`, sticky sidebar uses `top-32` (accounts for nav height), no conflict expected
