## Context

The checkout page (`app/checkout/page.tsx`) hard-codes a `DEMO_ITEMS` array for the order summary. Each item has an `icon` field (a Material Symbol name) rendered inside a colored square. The Stitch design specifies product photo thumbnails — matching the visual language used on product listing pages.

The `product-placeholder-image` spec already mandates `public/images/product-placeholder.svg` for broken/missing images; this change wires the checkout item list into that contract.

## Goals / Non-Goals

**Goals:**
- Replace icon containers in the order summary with `<img>` elements
- Show the placeholder SVG when `imageUrl` is missing or fails to load (`onError`)
- Update the `DEMO_ITEMS` fixture with `imageUrl` strings so the page looks correct without API data

**Non-Goals:**
- Connecting the checkout to a live cart API (out of scope)
- Using `next/image` `<Image>` — external domains would need `remotePatterns` config; a plain `<img>` is sufficient for demo data and avoids config churn
- Changing any other aspect of the checkout layout or form

## Decisions

**Plain `<img>` over `next/image`**
The demo items reference the Stitch-provided hosted URLs (Google AI content delivery). Adding those domains to `next.config` is unnecessary friction for static demo data. A plain `<img>` with `object-cover` fills the same role. When real API data is wired up, the image rendering can be revisited then.

**`onError` fallback instead of conditional rendering**
Using `onError` to swap `src` to the placeholder keeps the JSX uniform — one `<img>` per item regardless of whether `imageUrl` is populated. This matches the pattern used across product cards in the design system.

## Risks / Trade-offs

- [Demo URLs may expire] → Acceptable; the fallback SVG will display instead, and the spec requires the fallback to work. Real URLs come from the API in the future.
- [Layout shift if images load slowly] → The `<img>` container is fixed at `w-24 h-24`; dimensions are locked so there's no CLS.
