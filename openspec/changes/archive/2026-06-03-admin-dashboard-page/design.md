## Context

The admin dashboard (`app/admin/dashboard/page.tsx`) is a Server Component that fetches summary stats, top products, and peak-hours data in parallel, then renders them. The sidebar is a separate `AdminSidebar` component handled by `app/admin/layout.tsx`. Recent work has brought the sidebar, product listing, and checkout pages onto the Kafe "Warm Roast" design system; the dashboard page is the last major admin surface without that treatment.

The Stitch reference design (screen `f6f0fd7bd88344d7832be7703e7d3ee4`) defines the target layout: a sticky in-page header, three warm-surface stat cards, a bento-grid analytics area, and a new Inventory Alerts panel below.

## Goals / Non-Goals

**Goals:**
- Restyle the dashboard page to match the Stitch design using existing Kafe Tailwind tokens
- Add an in-page sticky header (title, date, Generate Report button, notification bell)
- Introduce the Inventory Alerts widget backed by a low-stock API query
- Preserve all existing functional behaviour (date range filter, server-side fetches, PeakHoursChart SVG)

**Non-Goals:**
- Generate Report button is UI-only in this change; actual report generation is out of scope
- Notification bell is static decoration; real-time notification infrastructure is out of scope
- No changes to the sidebar or `app/admin/layout.tsx`
- No API schema changes

## Decisions

### Keep page as a Server Component
The existing page is already a Server Component with async data fetching. All new data (low-stock items) will be fetched at the same level via an additional `getInventoryAlerts()` call added to the existing `Promise.all`. This avoids a client boundary for data that does not need interactivity.

Alternatives considered: extracting each widget into a Suspense-wrapped async child component. Rejected for this change because it would require splitting the existing `searchParams` prop threading and is premature without evidence of slow individual queries.

### Inventory Alerts: new API call, not a new route segment
Low-stock items will be fetched in the same server function alongside summary/topProducts/peakHours. A threshold of ≤ 20% stock level defines "low" (matching the Stitch design's progress bar proportions of 15% and 10%).

Alternatives considered: a dedicated `/api/admin/inventory/alerts` endpoint. Rejected because the existing inventory API already returns stock quantities and the dashboard only needs a small read; a new route adds deployment surface for no gain at this stage.

### Empty states for analytics widgets
The Stitch design shows empty-state placeholders for "Best Selling Products" and "Peak Hours" when data is absent. The existing page renders `null` or a plain text message. The redesign will render the dashed-border empty-state card matching the design exactly, keeping the existing data-present rendering as-is.

### "Generate Report" is a toast-only interaction
The button shows a success toast on click (as in the Stitch HTML reference). No backend call. The interaction is implemented with a small Client Component wrapper that owns only the button + toast, keeping the parent Server Component intact.

## Risks / Trade-offs

- **Low-stock threshold hardcoded at 20%**: If the inventory API does not expose a percentage or max-quantity field, the threshold logic may need to be estimated from a separate max-capacity field. → Mitigation: check `getInventoryItems` return shape before implementing; fall back to raw quantity < 10 if percentage is unavailable.
- **Page weight**: Adding one more parallel fetch (inventory alerts) increases cold-start time marginally. → Acceptable; all four fetches run in parallel and inventory data is a small payload.
- **In-page header vs. layout header**: Placing the header inside the route rather than in `layout.tsx` means it won't carry over to other admin routes. → Intentional per the design; other admin pages have their own headers.

## Open Questions

- Does `getInventoryItems` already support a `lowStock` filter param, or does filtering need to happen client-side from the full list?
- Should the "Restock Now" button in the Inventory Alerts panel link to the existing Inventory admin route, or open a modal?
