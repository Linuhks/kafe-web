## Context

The project already has brand colors defined in `app/globals.css` and image remote patterns in `next.config.ts`. The only outstanding item from Task 4 is the product placeholder image. `ProductCard` expects a fallback at `/images/product-placeholder.svg` when a product has no `imageUrl`.

## Goals / Non-Goals

**Goals:**
- Provide a static SVG at `public/images/product-placeholder.svg` that renders a recognizable coffee/product icon
- Ensure `next/image` can serve it locally without layout shift

**Non-Goals:**
- Redesigning existing brand color variables — they are already correct and in use
- Adding any new Tailwind utilities or CSS custom properties

## Decisions

**SVG over PNG/JPEG**: SVG is resolution-independent, zero external dependency, and trivially version-controlled. No build step needed.

**Simple coffee cup icon**: Matches the café brand, immediately recognizable, works at thumbnail sizes used by `ProductCard`.

## Risks / Trade-offs

No meaningful risks. The file is purely additive and static.
