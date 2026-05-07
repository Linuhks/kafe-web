## 1. API Layer

- [x] 1.1 Extend `lib/api/products.ts` with `createProduct(data)`, `updateProduct(id, data)`, `deleteProduct(id)`, `toggleProductAvailability(id)`
- [x] 1.2 Add `addProductIngredient(productId, data)`, `removeProductIngredient(productId, ingredientId)`, `getProductIngredients(productId)` to `lib/api/products.ts`

## 2. Shared Admin Components

- [x] 2.1 Create `components/admin/DataTable.tsx` with typed columns/rows props, client-side sorting (asc/desc toggle per column), and pagination controls that sync to URL `?page=N`
- [x] 2.2 Create `components/admin/ConfirmModal.tsx` wrapping Shadcn `Dialog` with title, description, Cancel, and Confirm (destructive variant) buttons
- [x] 2.3 Create `lib/hooks/useFormDirty.ts` — accepts initial values and current values, returns `isDirty`; registers `beforeunload` listener when dirty

## 3. Product List Page

- [x] 3.1 Create `app/admin/products/page.tsx` as a Server Component — fetch products server-side and render `DataTable` with columns: name, category, price, availability toggle, Edit link, Delete button
- [x] 3.2 Wire availability toggle to call `toggleProductAvailability` via a Client Component island; invalidate product list query on success/failure with toast feedback

## 4. Create Product Page

- [x] 4.1 Create `app/admin/products/new/page.tsx` as a Client Component with controlled form fields: name, description, price, imageUrl, categoryId (Select populated from categories API), isAvailable (checkbox)
- [x] 4.2 Add form validation (required fields, price must be a positive number) with inline error messages
- [x] 4.3 On submit: call `createProduct`, show success toast, redirect to `/admin/products`; on error: show error toast, keep form open with values
- [x] 4.4 Attach `useFormDirty` to warn on navigation when form has unsaved changes

## 5. Edit Product Page

- [x] 5.1 Create `app/admin/products/[id]/edit/page.tsx` as a Client Component — fetch existing product data and pre-populate all form fields (same fields as create form)
- [x] 5.2 On submit: call `updateProduct`, show success toast, redirect to `/admin/products`; on error: show error toast, keep form open
- [x] 5.3 Add ingredient management section: fetch and list current ingredients (name + quantity) using `getProductIngredients`
- [x] 5.4 Add "Add ingredient" row: ingredient Select (populated from ingredients API) + quantity input + Add button calling `addProductIngredient`; prevent adding duplicate ingredients with inline error
- [x] 5.5 Add Remove button per ingredient row calling `removeProductIngredient` with immediate list update
- [x] 5.6 Attach `useFormDirty` to warn on navigation when form has unsaved changes

## 6. Delete Flow

- [x] 6.1 Wire the Delete button in the product list to open `ConfirmModal` with the product name
- [x] 6.2 On confirm: call `deleteProduct`, close modal, show success toast, refresh product list; on cancel: close modal with no side effects
