## Context

After checkout completes, users have no confirmation screen — they see a blank state. The confirmation screen needs to show order success, the items purchased, an estimated pickup time, and the pickup location. The Stitch design is desktop-first with a two-column bento layout, following the same design tokens as the rest of the app (`kafe-*` colors, `text-label-sm`, `text-headline-md`, etc.).

## Goals / Non-Goals

**Goals:**
- Route `/checkout/confirmation` renders a full order confirmation page
- Page matches the Stitch design: success hero, status tracker, order summary card, pickup location card, support card, footer actions
- Follows the same layout conventions as checkout (12-col grid, shared `TopNavBar`/`Footer`)
- Product item images reuse the same image pipeline as checkout (with placeholder fallback)

**Non-Goals:**
- Real-time order status polling (status tracker is static for now — "Received" is the initial state)
- Interactive map (map is a static image placeholder)
- Actual receipt PDF generation
- Push notifications or email re-send from this page

## Decisions

### Route: `/checkout/confirmation` as a Server Component

The page reads order data server-side from a cookie or query param (`orderId`), calls `GET /orders/:id`, and renders the result. No client-side state is needed for the static confirmation view — so it stays a Server Component. Only the animated check icon (float animation) and the progress bar initial render need CSS-only animation — no `'use client'` required.

**Alternative considered:** Query-param-only approach (pass order data via URL). Rejected — too much data (items, prices) to encode safely in a URL; server fetch is cleaner.

### Image handling: reuse checkout pattern

Item thumbnails use a native `<img>` with `object-cover`, falling back to `/images/product-placeholder.svg` via `onError`. This requires an inline `onError` handler, which forces the image wrapper into a `'use client'` sub-component — same pattern already used in the checkout sidebar.

**Alternative considered:** Next.js `<Image>`. Deferred — requires configuring remote domains for every CDN; the simpler native img matches the existing checkout code.

### Status tracker: static, CSS-only progress bar

The 3-step tracker (Received → Roasting → Ready) is rendered as a static progress bar seeded with the order's current status. No polling on this screen — a refresh or a dedicated order-tracking page handles live updates.

## Risks / Trade-offs

- [Order data unavailable] If the API call for the order fails or the `orderId` is missing, the page must degrade gracefully (show a generic "Order placed" message without item details). → Mitigation: wrap order fetch in try/catch; render a minimal success state if fetch fails.
- [Images from external CDN] Product images may be from an external origin not whitelisted in CSP. → Mitigation: same risk exists on checkout; no new action needed here.
- [No real-time status] Users who refresh the page will not see live order progress. → Accepted trade-off for now; a dedicated order history page covers this.
