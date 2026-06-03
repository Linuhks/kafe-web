## Why

The admin product listing at `/admin/products` uses generic Shadcn/DataTable components that don't match Kafe's design system. The Stitch reference design shows a richer table layout with product thumbnails, colour-coded category badges, inline search/filter chips, and design-token–consistent typography — bringing the admin experience in line with the established visual language.

## What Changes

- **`app/admin/products/page.tsx`** — Replace the plain `<h1>` + Button header with a two-column header matching the Stitch design: descriptive subtitle on the left, "Add New Product" CTA on the right
- **`components/admin/ProductsTable.tsx`** — Rewrite the table UI to match the Stitch design:
  - Product name cell: 48 × 48 thumbnail (using `productImage` from DTO or placeholder), name in `text-kafe-primary`, subtitle (category + availability hint) below
  - Category cell: colour-coded pill badge (Coffee Beans → tertiary-fixed, Brewing Gear → secondary-fixed, Subscription → primary-fixed, default → surface-container)
  - Price cell: right-aligned, `text-headline-md` size
  - Availability cell: existing toggle switch restyled with `bg-kafe-primary` when on
  - Actions cell: icon-only ghost buttons (edit → `hover:text-kafe-primary`, delete → `hover:text-kafe-error`)
  - Search input row + category filter chips (All Items, Coffee Beans, Brewing Gear, Gifts) above the table — client-side filtering
  - Table header: `bg-kafe-surface-container-low`, `text-label-sm uppercase tracking-wider text-kafe-on-surface-variant`
  - Table wrapper: `bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl`
  - Pagination bar: `bg-kafe-surface-container-low border-t` with chevron buttons

## Capabilities

### New Capabilities
- `admin-product-listing-ui`: Visual redesign of the product listing table and page header to match the Kafe design system, including search input, category filter chips, product thumbnails, and design-token–consistent table styles

### Modified Capabilities
- `admin-product-management`: Table UI gains client-side search and category filter chips — the search and filter operate purely in the browser without new API calls or URL params

## Impact

- **Files changed**: `app/admin/products/page.tsx`, `components/admin/ProductsTable.tsx`
- **No API or data-model changes** — same props interface, same hooks
- **No breaking changes to existing tests** — `ProductsTable.test.tsx` stubs remain valid; visual assertions may need updating
- **Design tokens** must be resolved via `kafe-*` Tailwind classes (already in `tailwind.config.ts`)
