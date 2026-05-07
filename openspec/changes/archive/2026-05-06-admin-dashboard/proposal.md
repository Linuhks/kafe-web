## Why

The admin role has no dedicated interface — admins currently have no way to monitor business performance or manage the café. The dashboard provides the first admin-facing screen, giving visibility into sales, order volume, and peak hours.

## What Changes

- New `/admin/layout.tsx` with a sidebar for admin navigation (Dashboard, Products, Categories, Users, Inventory)
- New `/admin/dashboard/page.tsx` — Server Component that fetches summary, top products, and peak hours in parallel
- New `components/admin/DateRangePicker.tsx` — Client Component driving URL-param-based date filtering
- New `components/admin/PeakHoursChart.tsx` — native SVG bar chart (no external chart library)
- New `lib/api/dashboard.ts` — typed wrappers for the three dashboard API calls
- Middleware already protects `/admin/*` (ADMIN role required) — no changes needed there

## Capabilities

### New Capabilities

- `admin-dashboard`: Analytics overview page with summary cards, top-products table, and peak-hours SVG chart; date range is controlled via URL search params

### Modified Capabilities

_(none — no existing spec requirements are changing)_

## Impact

- **New routes**: `/admin/layout.tsx`, `/admin/dashboard/page.tsx`
- **New components**: `components/admin/DateRangePicker.tsx`, `components/admin/PeakHoursChart.tsx`
- **New lib**: `lib/api/dashboard.ts`
- **APIs consumed**: `GET /api/v1/analytics/summary`, `GET /api/v1/analytics/top-products`, `GET /api/v1/analytics/peak-hours` (existing backend endpoints)
- **Dependencies**: none new — uses existing Shadcn/Radix primitives and `lucide-react`
- **Roles**: ADMIN only (enforced by existing middleware)
