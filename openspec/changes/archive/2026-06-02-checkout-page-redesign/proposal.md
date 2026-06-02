## Why

The current checkout is a modal, which limits the amount of form space available and creates a disjointed experience for a multi-step flow (contact → shipping → payment). A dedicated full-page checkout provides better clarity, scrollability, and room for an order summary sidebar. As part of this, the nav and footer patterns established in the design system need to be extracted as shared components so they can be reused consistently across pages.

## What Changes

- Replace the checkout modal with a dedicated `/checkout` route (`app/checkout/page.tsx`)
- Create a two-column layout: left column with numbered form sections (contact, shipping, payment) and right sticky column with order summary, price breakdown, and promo code
- Extract a reusable `TopNavBar` component (`components/layout/TopNavBar.tsx`) matching the design system nav pattern
- Extract a reusable `Footer` component (`components/layout/Footer.tsx`) matching the design system footer pattern
- Both layout components use the `kafe-*` Tailwind tokens from the existing design system

## Capabilities

### New Capabilities

- `checkout-page`: Full-page checkout with numbered sections (01 Contact, 02 Shipping, 03 Payment), sticky order summary sidebar, promo code input, trust badges, and confirm purchase CTA
- `shared-layout-components`: Reusable `TopNavBar` and `Footer` React components extracted from the design system, ready to compose into any page layout

### Modified Capabilities

## Impact

- New route: `app/checkout/page.tsx`
- New components: `components/layout/TopNavBar.tsx`, `components/layout/Footer.tsx`
- No API changes; form submission is UI-only at this stage
- No changes to existing pages (components are additive)
