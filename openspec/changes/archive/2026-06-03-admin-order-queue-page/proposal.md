## Why

The admin panel lacks a dedicated order queue view — admins currently have no way to monitor and manage live orders from within the admin area. The Kafe design system redesign warrants a purpose-built admin order queue page consistent with the new visual language already applied to other admin pages.

## What Changes

- Add new route `/admin/orders` with a Kafe-design-system order queue page
- Add "Fila de pedidos" link to `AdminSidebar` nav items
- New page features:
  - Filter tabs: Todos, Recebidos, Em preparo, Concluídos
  - Bento-style 3-column order card grid
  - Per-card action buttons (Iniciar preparo / Marcar como pronto) with live status updates
  - Page header with search input and notifications icon
  - Footer stats bar (avg preparation time, active orders count, team avatars)
- Reuses existing `useOrdersControllerQueue` and `useOrdersControllerUpdateStatus` hooks

## Capabilities

### New Capabilities

- `admin-order-queue`: Admin-facing order queue page at `/admin/orders` — filter, view, and advance order status with Kafe design system styling

### Modified Capabilities

- `admin-product-listing-ui`: No requirement changes — reference only for design system conventions

## Impact

- New file: `app/admin/orders/page.tsx`
- New file: `components/admin/AdminOrderQueueClient.tsx` (client component with state)
- Modified: `components/admin/AdminSidebar.tsx` — add "Fila de pedidos" nav entry (visual only, no behaviour change)
- API hooks: `useOrdersControllerQueue`, `useOrdersControllerUpdateStatus` (already used by barista queue)
