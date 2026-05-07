## 1. API Module

- [x] 1.1 Add `createProduct(data)` wrapper to `lib/api/products.ts`
- [x] 1.2 Add `updateProduct(id, data)` wrapper to `lib/api/products.ts`
- [x] 1.3 Add `deleteProduct(id)` wrapper to `lib/api/products.ts`
- [x] 1.4 Add `toggleProductAvailability(id)` wrapper to `lib/api/products.ts`
- [x] 1.5 Add `getProductIngredients(productId)` wrapper to `lib/api/products.ts`
- [x] 1.6 Add `addProductIngredient(productId, data)` wrapper to `lib/api/products.ts`
- [x] 1.7 Add `removeProductIngredient(productId, ingredientId)` wrapper to `lib/api/products.ts`

## 2. Shared Admin Components

- [x] 2.1 Create `components/admin/DataTable.tsx` with sortable columns and pagination
- [x] 2.2 Create `components/admin/ConfirmModal.tsx` for destructive-action confirmation dialogs
- [x] 2.3 Create `lib/hooks/useFormDirty.ts` with `setDirty`, `confirmNavigation`, and `beforeunload` registration

## 3. Product List Page

- [x] 3.1 Create `components/admin/ProductsTable.tsx` wrapping `DataTable` with availability toggle and delete actions
- [x] 3.2 Create `app/admin/products/page.tsx` as a Server Component fetching products and categories
- [x] 3.3 Wire optimistic availability toggle mutation in `ProductsTable`
- [x] 3.4 Wire delete confirmation flow using `ConfirmModal` in `ProductsTable`

## 4. Create Product Page

- [x] 4.1 Create `app/admin/products/new/page.tsx` as a Client Component
- [x] 4.2 Implement category select populated from `useCategoriesControllerList`
- [x] 4.3 Add inline validation (name required, category required, price positive number)
- [x] 4.4 Integrate `useFormDirty` to protect unsaved changes on navigation

## 5. Edit Product Page

- [x] 5.1 Create `app/admin/products/[id]/edit/page.tsx` as a Client Component
- [x] 5.2 Pre-fill form fields from `useProductsControllerGetOne`
- [x] 5.3 Implement ingredient list section showing linked ingredients with name and quantity
- [x] 5.4 Implement add-ingredient flow (select + quantity input, duplicate guard, add button)
- [x] 5.5 Implement remove-ingredient flow with per-row remove button
- [x] 5.6 Integrate `useFormDirty` for unsaved-changes protection on the edit form
