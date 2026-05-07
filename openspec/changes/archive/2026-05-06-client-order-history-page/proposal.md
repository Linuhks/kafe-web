## Why

Clients have no visibility into their order history after placing an order. The `/orders/me` route is planned in the route map but unbuilt, leaving CLIENT users with a dead link and no way to track past or current orders.

## What Changes

- New page `app/orders/me/page.tsx` — Server Component, protected by middleware, fetches the authenticated client's paginated order list
- New `lib/api/orders.ts` — server-side data fetch wrapper around the generated `ordersControllerMyOrders` hook, following the same pattern as `lib/api/dashboard.ts`
- Updated `components/layout/NavBar.tsx` — adds a "My Orders" link visible only to CLIENT-role users

## Capabilities

### New Capabilities

- `client-order-history`: Paginated order history page for authenticated clients, showing each order's ID, status (color-coded badge), item list, timestamp, and total amount, with URL-driven page navigation

### Modified Capabilities

## Impact

- New route: `/orders/me` (already covered by middleware auth guard)
- New file: `lib/api/orders.ts`
- Modified: `components/layout/NavBar.tsx`
- Uses existing: generated `ordersControllerMyOrders` from `lib/api/generated/api.ts`, `Pagination` component from `components/ui/pagination.tsx`, `Skeleton` from `components/ui/skeleton`
