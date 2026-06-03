## Why

The admin categories page (`/admin/categories`) still uses generic Tailwind utilities and shadcn `Button`, while the rest of the admin section has been migrated to the Kafe design system. This creates visual inconsistency across admin screens.

## What Changes

- Replace `text-2xl font-bold` heading with `text-headline-lg text-kafe-primary` typography tokens
- Replace the shadcn `Button` + `Link` combo with the same Kafe-styled link button used in the products page
- Update the `CategoriesTable` component to match the visual style of `ProductsTable` (Kafe surface, text tokens, hover states)
- Remove the `Button` import from shadcn (`@/components/ui/button`) in the page

## Capabilities

### New Capabilities

- `admin-categories-listing-ui`: Visual redesign of the admin categories list page to match the Kafe design system — header typography, primary action button, and table styling aligned with the product listing page.

### Modified Capabilities

<!-- none -->

## Impact

- `app/admin/categories/page.tsx` — page header and action button
- `components/admin/CategoriesTable.tsx` — table rows, column labels, action styles
