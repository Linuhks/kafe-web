## Context

The admin panel already has dashboard, product, category, and user management pages. The inventory subsystem is backed by a full REST API (generated in `lib/api/generated/api.ts` via Orval): `inventoryControllerList`, `inventoryControllerGetOne`, `inventoryControllerCreate`, `inventoryControllerUpdate`, `inventoryControllerRestock`, `inventoryControllerMovements`. The admin sidebar already includes an Inventory link pointing to `/admin/inventory`. No new backend work is needed.

Stock quantities are stored as decimal strings in the backend DTOs (`currentStock`, `minimumStock` on `IngredientResponseDto`). Movement records carry `ingredientId`, `type`, `quantity`, `note`, `orderId`, and `createdAt`.

## Goals / Non-Goals

**Goals:**
- Inventory list page with stock status badges and action entry points
- Restock form page for a single ingredient
- Movement history page with date-range and ingredient filters, paginated
- `lib/api/inventory.ts` wrapping the Orval-generated functions using the same pattern as `lib/api/products.ts`

**Non-Goals:**
- Create/edit ingredient forms (not requested by task 14 — ingredient creation belongs to a separate flow)
- Real-time push updates (polling not required here)
- Deleting ingredients

## Decisions

**1. `lib/api/inventory.ts` wraps Orval-generated functions (not raw `apiFetch`)**
Rationale: `products.ts` already establishes this pattern. Orval-generated functions are typed and handle URL construction. Using them keeps the module consistent and avoids duplicating URL logic.

**2. Inventory list as a Server Component; restock form as a Client Component**
The list page only reads data and has no interactivity beyond navigation links — Server Component is appropriate. The restock form needs controlled inputs and a submit handler — Client Component is required. Movements page is read-only with URL-param filters, making it a Server Component with a Client `DateRangePicker` sub-component for updating params.

**3. Stock status badge derived from string comparison via `parseFloat`**
`currentStock` and `minimumStock` are decimal strings. Status is `LOW STOCK` when `parseFloat(currentStock) < parseFloat(minimumStock)`, otherwise `OK`. This logic lives in a small utility or inline in the table row.

**4. Date range filter on movements page via URL search params (not query params to backend)**
The backend `InventoryControllerMovementsParams` only accepts `ingredientId` and `orderId` — it has no date range filter. Date filtering is therefore done client-side on the fetched result set, or by passing from/to as additional query params if the backend supports them. Given the current generated types lack date params, the movements page will fetch all movements for a given ingredient and filter by date client-side. A `DateRangePicker` updates URL params; the Server Component reads them and filters the array before rendering.

**5. Restock form navigates back to `/admin/inventory` on success**
Consistent with the edit patterns in product management. Uses `useRouter().push('/admin/inventory')` after a successful restock mutation.

## Risks / Trade-offs

- **Date filtering is client-side** → for large movement histories this loads all records. Acceptable for now given no backend date param support. [Risk] large datasets degrade page performance → Mitigation: paginate movements and document the backend limitation.
- **Decimal string arithmetic** → `parseFloat` may introduce floating-point edge cases near the minimum threshold. [Risk] badge flickers at exact equality → Mitigation: use `>=` comparison (OK when equal), consistent with task spec.
- **No ingredient create/edit UI** → admins cannot add new ingredients from the inventory pages. This is intentional per task scope; product-ingredient management is handled via the products pages.
