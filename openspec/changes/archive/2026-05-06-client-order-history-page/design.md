## Context

The app has a planned `/orders/me` route (listed in `app/CLAUDE.md`) guarded by middleware for the CLIENT role, but the page does not yet exist. The backend exposes `GET /api/v1/orders/my-orders` (generated as `ordersControllerMyOrders` in `lib/api/generated/api.ts`) which returns a paginated list of the authenticated client's orders. The NavBar currently shows a cart for CLIENT users but no link to their order history.

## Goals / Non-Goals

**Goals:**
- Render `/orders/me` as a Server Component that fetches and displays the client's paginated order list
- Add a `lib/api/orders.ts` server-side data wrapper following the `lib/api/dashboard.ts` pattern
- Add a "My Orders" NavBar link visible only to CLIENT-role users

**Non-Goals:**
- Real-time order status updates (polling)
- Order detail pages or individual order views
- Order cancellation or management actions
- Admin/barista order views (separate feature)

## Decisions

### Server Component for the page

`app/orders/me/page.tsx` is a Server Component that awaits `searchParams` to read the `page` URL param, then calls `getMyOrders({ page })` from `lib/api/orders.ts` directly — no client-side React Query needed. This matches the pattern used by `app/admin/dashboard/page.tsx`.

**Alternatives considered:** Client Component with `useOrdersControllerMyOrders` — rejected because it adds unnecessary client bundle weight and prevents server-side data fetching; the page has no interactivity that requires client-side state.

### URL-driven pagination

The current page number is stored in the `?page=` URL search param, not in component state. Navigation between pages uses `<Link>` or the existing `Pagination` component from `components/ui/pagination.tsx`.

**Alternatives considered:** Client-side state pagination — rejected because URL-driven pagination is shareable, bookmarkable, and consistent with server rendering.

### NavBar CLIENT link

The NavBar is a `'use client'` component that already has access to `useAuth()`. Adding a "My Orders" link for `user.role === 'CLIENT'` requires no architectural change — just a conditional `<Link>` in the existing actions row.

### No `lib/api/orders.ts` for client side

The generated `useOrdersControllerMyOrders` hook remains available for future client-side use cases (e.g., polling, optimistic updates). The new `lib/api/orders.ts` wraps only the server-callable plain function `ordersControllerMyOrders` for Server Component data fetching.

## Risks / Trade-offs

- [Pagination API] The backend's `my-orders` endpoint may not support `page`/`limit` params — the generated type `OrdersControllerMyOrders200Pagination` shows these fields but they may be optional. → Mitigation: implement pagination UI driven by the response's `pagination` metadata; hide controls if `totalPages <= 1`.
- [NavBar CLIENT link] NavBar is rendered on all pages including the catalog and barista queue. Adding the link requires care not to show it to BARISTA/ADMIN users. → Mitigation: gate strictly on `user?.role === 'CLIENT'`.

## Open Questions

- Does `ordersControllerMyOrders` accept query params for `page` and `limit`? The generated function signature shows no params — may require a custom fetch or the backend paginates implicitly.
