## Why

The admin dashboard page exists functionally but uses a generic layout with no visual identity. The Stitch design delivers the full Kafe "Warm Roast" visual treatment — matching the design language already applied to the sidebar, product listing, and checkout pages — so the admin area becomes coherent with the rest of the product.

## What Changes

- Redesign `app/admin/dashboard/page.tsx` with the Kafe design system: warm-surface stat cards, bento-grid analytics layout, and the "Warm Roast" typographic scale.
- Add a sticky in-page header ("Overview" title, date line, notification bell, Generate Report button) inside the dashboard route, distinct from the sidebar.
- Introduce an **Inventory Alerts** widget on the dashboard showing low-stock items with a progress bar and "Restock Now" action per item.
- Replace the plain top-products table with a "Best Selling Products" panel that renders an empty state when no data is available.
- Replace the existing chart wrapper with a "Peak Hours" panel that renders an empty state alongside the existing SVG chart component.

## Capabilities

### New Capabilities

- `admin-dashboard-inventory-alerts`: Dashboard widget that surfaces low-stock inventory items with a quantity progress bar and a "Restock Now" shortcut.

### Modified Capabilities

- `admin-dashboard`: Visual layout of the dashboard page is changing to use the Kafe design system (stat cards, bento grid, sticky header, empty states). Functional requirements (summary cards, top products, peak hours, date range filter) are unchanged; the rendering and visual treatment differ.

## Impact

- `app/admin/dashboard/page.tsx` — primary file rewritten
- `components/admin/` — new `DashboardInventoryAlerts` component (or inlined)
- No API changes; existing `getDashboardSummary`, `getTopProducts`, `getPeakHours` calls are reused
- `lib/api/inventory` or similar — may need a low-stock query endpoint if not already present
