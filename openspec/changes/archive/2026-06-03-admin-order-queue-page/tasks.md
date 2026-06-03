## 1. AdminSidebar — add nav entry

- [x] 1.1 Import `ClipboardList` icon from `lucide-react` in `components/admin/AdminSidebar.tsx`
- [x] 1.2 Add `{ href: '/admin/orders', label: 'Fila de pedidos', icon: ClipboardList }` to the `navItems` array
- [x] 1.3 Update `components/admin/AdminSidebar.test.tsx` to assert the new nav item renders

## 2. Client component — AdminOrderQueueClient

- [x] 2.1 Create `components/admin/AdminOrderQueueClient.tsx` as a `'use client'` component
- [x] 2.2 Wire `useOrdersControllerQueue` with `refetchInterval: 15_000` for live polling
- [x] 2.3 Wire `useOrdersControllerUpdateStatus` mutation with toast feedback on success/error
- [x] 2.4 Implement status filter tabs (Todos / Recebidos / Em preparo / Concluídos) with counts
- [x] 2.5 Implement search input filtering by customer name (case-insensitive, client-side)
- [x] 2.6 Render order cards in a `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` bento grid
- [x] 2.7 Each card: customer name, order number + time, status badge, items list, contextual action button
- [x] 2.8 Status badge styles: `secondary-container` tokens for EM PREPARO, `surface-container-highest` for RECEBIDO
- [x] 2.9 Action buttons: "Iniciar preparo" (outline) for RECEIVED → advances to IN_PREPARATION; "Marcar como pronto" (filled) for IN_PREPARATION → advances to READY
- [x] 2.10 Disable action button and show loading state while update is in-flight for that order
- [x] 2.11 Render skeleton grid (4 cards) while `isPending`
- [x] 2.12 Render empty state message when no orders match the active filter
- [x] 2.13 Render footer stats bar: active order count, placeholder team avatars (B1, B2, CZ)

## 3. Page route

- [x] 3.1 Create `app/admin/orders/page.tsx` as a server component with `export const dynamic = 'force-dynamic'`
- [x] 3.2 Set page title metadata and render `<AdminOrderQueueClient />`

## 4. Verify

- [x] 4.1 Run `pnpm tsc --noEmit` and fix any TypeScript errors
- [x] 4.2 Run `pnpm test` and confirm existing tests still pass
- [x] 4.3 Start dev server and verify the page renders, filter tabs work, and status updates apply
