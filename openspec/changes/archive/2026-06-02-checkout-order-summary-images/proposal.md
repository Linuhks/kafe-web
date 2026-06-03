## Why

The checkout page order summary shows Material icon placeholders for cart items instead of actual product photos. The Stitch design specifies real `<img>` thumbnails — matching what customers see on the product pages — so the order summary feels cohesive and trustworthy at the point of purchase.

## What Changes

- Replace the icon-based thumbnails in the order summary item list with `<img>` elements that accept a product `imageUrl`
- Fall back to `public/images/product-placeholder.svg` (already exists) when `imageUrl` is absent
- Update the `DEMO_ITEMS` fixture to include `imageUrl` fields pointing to the Stitch reference images, so the page renders correctly without a live API

## Capabilities

### New Capabilities

### Modified Capabilities

- `checkout-page`: Order summary item thumbnails change from Material icon placeholders to `<img>` elements with fallback to the existing product placeholder SVG

## Impact

- `app/checkout/page.tsx` — swap icon containers for `<img>` / `<Image>` elements in the item list
- No new routes, APIs, or dependencies
- `product-placeholder-image` spec stays intact; this change consumes it
