## Why

Task 4 from the project roadmap is marked in-progress: brand colors and `next.config.ts` image domains are already wired up, but the product placeholder SVG is missing. Without it, `next/image` renders a broken fallback for products that have no image URL.

## What Changes

- Create `public/images/product-placeholder.svg` — a simple coffee cup SVG used as the `<Image>` fallback when a product has no `imageUrl`

## Capabilities

### New Capabilities
- `product-placeholder-image`: Static SVG asset served from `/images/product-placeholder.svg`, referenced as the fallback `src` in `ProductCard` when no product image URL is available

### Modified Capabilities

## Impact

- `public/images/product-placeholder.svg` — new file
- `components/catalog/ProductCard.tsx` — already uses a placeholder reference; this satisfies that dependency
