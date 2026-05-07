## Why

Admins need a full product management interface to create, update, and delete menu items, control availability in real time, and link ingredient requirements to each product for inventory tracking.

## What Changes

- `lib/api/products.ts`: expose `createProduct`, `updateProduct`, `deleteProduct`, `toggleProductAvailability`, `getProductIngredients`, `addProductIngredient`, `removeProductIngredient` as named async wrappers over generated Orval hooks
- `app/admin/products/page.tsx`: server-rendered list page with sortable, paginated DataTable showing name, category, price, availability toggle, and edit/delete actions
- `app/admin/products/new/page.tsx`: client-side create form with name, description, price, imageUrl, categoryId select, isAvailable checkbox, and inline validation
- `app/admin/products/[id]/edit/page.tsx`: client-side edit form pre-filled from API, plus an ingredient management section (list, add, remove)
- `components/admin/DataTable.tsx`: generic reusable sortable + paginated table component
- `components/admin/ProductsTable.tsx`: products-specific DataTable wrapper with availability toggle and delete confirmation
- `components/admin/ConfirmModal.tsx`: reusable confirmation dialog for destructive actions
- `lib/hooks/useFormDirty.ts`: tracks unsaved form state and registers `beforeunload` listener; provides `confirmNavigation` for in-app navigation

## Capabilities

### New Capabilities

- `admin-product-management`: full CRUD for products including availability toggle, ingredient linking, and dirty-form protection

### Modified Capabilities

## Impact

- `app/admin/products/*` routes (new)
- `components/admin/DataTable.tsx`, `ProductsTable.tsx`, `ConfirmModal.tsx` (new shared admin components)
- `lib/api/products.ts` (extended with write operations and ingredient sub-resource)
- `lib/hooks/useFormDirty.ts` (new shared hook, reusable by other admin forms)
- Depends on Orval-generated API types from `lib/api/generated/api.ts`
- Depends on `categoriesControllerList` and `useInventoryControllerList` from generated API
