## 1. Route Setup

- [x] 1.1 Create directory `app/checkout/confirmation/` and add `page.tsx` as a Server Component (no `'use client'`)
- [x] 1.2 Accept `orderId` search param in the page props and pass it to the order fetch helper
- [x] 1.3 Add a try/catch around the order fetch and define a minimal fallback render when data is unavailable

## 2. Success Hero Section

- [x] 2.1 Add the centered hero section: floating `check_circle` icon inside `bg-kafe-secondary-container` circle with CSS float animation
- [x] 2.2 Add the `h1` "Thank you for your order" in `text-headline-lg text-kafe-primary` and supporting paragraph in `text-body-lg text-kafe-on-surface-variant`

## 3. Order Status Card

- [x] 3.1 Build the status card inside `bg-surface-container-lowest border border-kafe-outline-variant rounded-xl`: estimated ready time on the left, order ID on the right
- [x] 3.2 Add the progress bar: `bg-kafe-surface-container rounded-full` track with a `bg-kafe-primary` fill seeded to 1/3 width for "Received" state
- [x] 3.3 Add the three step labels (Received, Roasting, Ready) with the active one in `text-kafe-primary font-bold`

## 4. Order Summary Card

- [x] 4.1 Build the card shell: `bg-surface-container-lowest border border-kafe-outline-variant rounded-xl overflow-hidden` with "Order Summary" heading
- [x] 4.2 Create a `ItemThumbnail` Client Component (`'use client'`) that renders a `w-16 h-16` native `<img>` with `object-cover` and an `onError` fallback to `/images/product-placeholder.svg`
- [x] 4.3 Map over order items: render `ItemThumbnail`, item name (`font-bold text-on-surface`), variant (`text-label-sm text-kafe-on-surface-variant`), and price (`font-bold text-primary`)
- [x] 4.4 Add the price breakdown footer: Subtotal, Tax rows in `text-body-md`, Total row in `text-headline-md text-kafe-primary`, separated by a `border-t border-kafe-outline-variant`

## 5. Pickup Location Card

- [x] 5.1 Build the location card: static map `<img>` at `h-48 w-full object-cover` at the top
- [x] 5.2 Add card body: "Pickup Location" heading in `text-headline-md text-kafe-primary`, store name in `font-bold text-on-surface`, address in `text-kafe-on-surface-variant`
- [x] 5.3 Add the full-width "Get Directions" CTA button: `bg-kafe-primary text-kafe-on-primary rounded-lg uppercase tracking-widest` with `chevron_right` icon

## 6. Support Card

- [x] 6.1 Add the support callout: `bg-secondary-container/10 border border-secondary-container rounded-xl` with `help_outline` icon, bold heading, and contact copy

## 7. Footer Actions

- [x] 7.1 Add "Return to Shop" link with `arrow_back` icon in `text-kafe-on-surface-variant hover:text-kafe-primary`
- [x] 7.2 Add "Download Receipt" button: `bg-kafe-surface-container-high text-kafe-primary rounded-full uppercase tracking-widest`

## 8. Responsive Layout

- [x] 8.1 Wrap status card + order summary in the left column (`md:col-span-7`) and pickup + support in the right column (`md:col-span-5`) inside a `grid grid-cols-1 md:grid-cols-12 gap-gutter-grid`

## 9. Shared Layout Integration

- [x] 9.1 Wrap the page with `TopNavBar` (logo + icons only, no nav links) and `Footer` — confirm both render correctly on the confirmation route
