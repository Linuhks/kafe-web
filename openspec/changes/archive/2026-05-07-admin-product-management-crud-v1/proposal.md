## Why

The admin product management CRUD is partially implemented — all pages, components, and hooks exist, but `lib/api/products.ts` is missing the write-side wrapper functions (create, update, delete, toggle availability, ingredient management) and the taskmaster task (ID 11) remains marked in-progress. This change completes the feature and closes the gap.

## What Changes

- Add `createProduct`, `updateProduct`, `deleteProduct`, `toggleProductAvailability` to `lib/api/products.ts`
- Add `addProductIngredient`, `removeProductIngredient`, `getProductIngredients` to `lib/api/products.ts`
- Update pages that call mutation hooks directly to go through the new wrappers where applicable to the server-component data-fetch pattern
- Mark taskmaster task 11 as done

## Capabilities

### New Capabilities

- `admin-product-management`: Full CRUD interface for products in the admin panel, including ingredient relationships and availability toggling

### Modified Capabilities

## Impact

- `lib/api/products.ts` — new exported functions added
- `app/admin/products/` pages — may reference new wrappers for server-side calls
- No new dependencies
