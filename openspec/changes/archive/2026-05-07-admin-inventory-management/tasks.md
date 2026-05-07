## 1. API Module

- [x] 1.1 Create `lib/api/inventory.ts` with `getInventory`, `getInventoryById`, `createIngredient`, `updateIngredient`, `restockIngredient`, and `getStockMovements` wrapping the Orval-generated inventory controller functions

## 2. Inventory List Page

- [x] 2.1 Create `app/admin/inventory/page.tsx` as a Server Component that fetches all ingredients via `getInventory()`
- [x] 2.2 Render a table with columns: Name, Unit, Current Stock, Minimum Stock, Status, Actions
- [x] 2.3 Implement stock status badge: green "OK" when `currentStock >= minimumStock`, red "LOW STOCK" when below
- [x] 2.4 Add "Restock" action button in each row linking to `/admin/inventory/[id]/restock`

## 3. Restock Form Page

- [x] 3.1 Create `app/admin/inventory/[id]/restock/page.tsx` as a Client Component
- [x] 3.2 Render a form with a required positive number input for quantity (min 0.01) and an optional note textarea
- [x] 3.3 On submit, call `restockIngredient(id, { quantity, note })` and navigate to `/admin/inventory` on success
- [x] 3.4 Show a destructive toast on API failure and keep the user on the form

## 4. Movement History Page

- [x] 4.1 Create `app/admin/inventory/movements/page.tsx` as a Server Component that fetches movements and ingredients
- [x] 4.2 Render a table with columns: Ingredient, Type, Quantity, Note, Order ID, Created At
- [x] 4.3 Add a Client Component date range picker that updates URL search params (`from` / `to`)
- [x] 4.4 Add an ingredient filter select (Client Component) that updates URL search param `ingredientId`
- [x] 4.5 Filter the fetched movements by date range and ingredientId from URL params before rendering
- [x] 4.6 Add Pagination component for the movements table
