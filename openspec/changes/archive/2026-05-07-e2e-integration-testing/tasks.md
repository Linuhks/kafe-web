## 1. Environment Configuration

- [x] 1.1 Create `.env.local.example` at repo root with `NEXT_PUBLIC_API_URL` as an optional commented-out variable and any other required env vars
- [x] 1.2 Verify dev server starts cleanly when `.env.local` is copied from the example

## 2. Anonymous Flow Validation

- [x] 2.1 Browse the public product catalog — verify categories, product cards, and images load
- [x] 2.2 Add items to cart — verify cart sidebar updates, quantities persist, sessionStorage is populated
- [x] 2.3 Place an order as an anonymous user — verify confirmation state and order submission

## 3. Client Flow Validation

- [x] 3.1 Log in as a CLIENT — verify redirect to `/orders/me`
- [x] 3.2 Browse catalog and place an order with pre-filled name — verify order goes through
- [x] 3.3 View order history — verify orders list, pagination, and status badges

## 4. Barista Flow Validation

- [x] 4.1 Log in as a BARISTA — verify redirect to `/barista/queue`
- [x] 4.2 View the order queue — verify real-time polling, order cards, and status display
- [x] 4.3 Advance an order through statuses — verify status button updates and toast notifications
- [x] 4.4 Verify inventory alert banner appears when low-stock ingredients are present

## 5. Admin Flow Validation

- [x] 5.1 Log in as an ADMIN — verify redirect to `/admin/dashboard`
- [x] 5.2 View dashboard with date range filter — verify analytics widgets and chart data
- [x] 5.3 Product management: create, edit, and delete a product with ingredients — verify CRUD and toast notifications
- [x] 5.4 Category management: create, edit, and delete a category
- [x] 5.5 User management: view users list, change a user's role
- [x] 5.6 Inventory: restock an ingredient — verify movement is recorded
- [x] 5.7 Inventory: view stock movements list and pagination

## 6. Cross-Cutting Verification

- [x] 6.1 Verify `proxy.ts` blocks CLIENT from `/barista/*` and `/admin/*` routes
- [x] 6.2 Verify `proxy.ts` blocks BARISTA from `/admin/*` routes
- [x] 6.3 Verify unauthenticated users are redirected to `/login` for protected routes
- [x] 6.4 Confirm all skeleton loaders appear during data fetches (throttle network if needed)
- [x] 6.5 Confirm all form dirty-state warnings appear when navigating away with unsaved changes
- [x] 6.6 Verify `next/image` remote patterns work and placeholder fallback displays on broken image URL
- [x] 6.7 Fix any bugs discovered during validation steps above
