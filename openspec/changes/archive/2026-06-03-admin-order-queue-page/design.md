## Context

The admin panel already has a redesigned sidebar, dashboard, and product listing using the Kafe design system (CSS custom properties, Plus Jakarta Sans, Kafe color tokens). The barista queue (`/barista/queue`) already implements order queue logic using `useOrdersControllerQueue` and `useOrdersControllerUpdateStatus` hooks. This change adds a parallel admin view at `/admin/orders` with richer UI: filter tabs, bento grid layout, footer stats, and full Kafe design language.

The existing `AdminSidebar` needs a "Fila de pedidos" entry pointing to `/admin/orders`.

## Goals / Non-Goals

**Goals:**
- New `/admin/orders` route with Kafe-styled order queue
- Filter tabs (Todos / Recebidos / Em preparo / Concluídos) with client-side filtering
- Order cards with status badges and contextual action buttons
- Footer stats bar (avg prep time placeholder, live order count, team avatars)
- Search input in header (visual — client-side filter by customer name)
- Add nav item to `AdminSidebar` without altering its existing structure or behavior

**Non-Goals:**
- Real-time push (polling via `refetchInterval` is sufficient, same as barista queue)
- Backend changes — reuses existing queue endpoint
- Avg prep time calculation from real data (display static placeholder in footer)
- Team avatar data from API (display static placeholder avatars)
- Modifying the barista queue page

## Decisions

**Client component split**: `app/admin/orders/page.tsx` is a thin server component (sets metadata, renders the client component). `components/admin/AdminOrderQueueClient.tsx` holds all state and hooks — consistent with the pattern used in `app/admin/products/page.tsx` and `app/barista/queue/page.tsx`.

**Reuse existing API hooks**: `useOrdersControllerQueue` already returns all active orders. Client-side filtering by status tab avoids additional API calls and latency.

**Status mapping**: Map API statuses (`RECEIVED`, `IN_PREPARATION`, `READY`, `DELIVERED`, `CANCELLED`) to display labels and badge styles matching the Kafe design tokens (`secondary-container` for EM PREPARO, `surface-container-highest` for RECEBIDO).

**Card action buttons**: Follow the design exactly — "Iniciar preparo" (outline style) for RECEIVED, "Marcar como pronto" (filled primary) for IN_PREPARATION. Reuse the same `useOrdersControllerUpdateStatus` mutation.

**AdminSidebar change is minimal**: Add one nav item `{ href: '/admin/orders', label: 'Fila de pedidos', icon: ClipboardList }` to `navItems` array. No layout or behaviour changes.

## Risks / Trade-offs

- [Footer avg time is a static placeholder] → Acceptable for v1; can be wired to real data later without spec changes
- [Client-side status filtering loads all active orders] → Queue is expected to be small (< 50 orders at any time), so no performance concern
- [AdminSidebar test may need update] → `AdminSidebar.test.tsx` likely checks nav items by label — add "Fila de pedidos" assertion
