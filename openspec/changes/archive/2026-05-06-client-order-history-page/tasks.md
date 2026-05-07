## 1. API Layer

- [x] 1.1 Create `lib/api/orders.ts` with `getMyOrders(params?: { page?: number })` that calls `ordersControllerMyOrders` from `lib/api/generated/api.ts` and returns `{ orders, pagination }` (null-safe on non-200)

## 2. Order History Page

- [x] 2.1 Create `app/orders/me/page.tsx` as an async Server Component that reads `?page` from `searchParams` and calls `getMyOrders`
- [x] 2.2 Render an order card for each order showing: short order ID, client name, color-coded status badge, items list with quantities, formatted `createdAt` timestamp, and BRL-formatted `totalAmount`
- [x] 2.3 Add skeleton loaders (using `Skeleton` from `components/ui/skeleton`) shown while the page renders (wrap data-dependent sections in `<Suspense>`)
- [x] 2.4 Add empty state ("Nenhum pedido encontrado") when the order list is empty
- [x] 2.5 Wire up `Pagination` from `components/ui/pagination.tsx` using `pagination.page` and `pagination.totalPages` from the API response; hide when `totalPages <= 1`

## 3. NavBar Update

- [x] 3.1 Add a "Meus Pedidos" `<Link href="/orders/me">` to `components/layout/NavBar.tsx`, visible only when `user?.role === 'CLIENT'`
