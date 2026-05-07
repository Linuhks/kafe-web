## Why

The admin panel is missing inventory visibility. Baristas and admins have no way to track ingredient stock levels, trigger restocks, or audit movement history — a critical operational gap as ingredient shortages can silently block orders.

## What Changes

- New `lib/api/inventory.ts` module with functions: `getInventory`, `getInventoryById`, `createIngredient`, `updateIngredient`, `restockIngredient`, `getStockMovements`
- New `/admin/inventory` page: data table of all ingredients with stock status badges (OK / LOW STOCK), restock and edit actions
- New `/admin/inventory/[id]/restock` page: restock form with quantity input and note field
- New `/admin/inventory/movements` page: movement history table with date range and ingredient filters, paginated
- Admin sidebar navigation updated to include Inventory link

## Capabilities

### New Capabilities
- `admin-inventory-list`: Paginated ingredient table with real-time stock status (OK / LOW STOCK) badges and action buttons
- `admin-inventory-restock`: Restock form for a single ingredient — positive quantity, optional note, posts to backend
- `admin-inventory-movements`: Filterable, paginated movement history with date range picker and ingredient select

### Modified Capabilities
- `admin-dashboard`: Sidebar navigation gains an Inventory link (visual/nav change, no requirement behavior change)

## Impact

- New file: `lib/api/inventory.ts`
- New pages: `app/admin/inventory/page.tsx`, `app/admin/inventory/[id]/restock/page.tsx`, `app/admin/inventory/movements/page.tsx`
- Existing admin layout sidebar updated (`app/admin/layout.tsx` or equivalent nav component)
- No new dependencies required — uses existing Shadcn primitives, Pagination component, and `apiFetch` fetcher
