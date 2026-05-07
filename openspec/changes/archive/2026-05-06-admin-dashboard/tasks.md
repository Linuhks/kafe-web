## 1. API Layer

- [x] 1.1 Create `lib/api/dashboard.ts` with `getDashboardSummary(dateRange)`, `getTopProducts(params)`, and `getPeakHours(dateRange)` — typed wrappers using `apiFetch`

## 2. Admin Layout

- [x] 2.1 Create `app/admin/layout.tsx` as a Server Component with `AdminSidebar` embedded
- [x] 2.2 Implement `AdminSidebar` with links: Dashboard, Products, Categories, Users, Inventory; highlight active route via `usePathname`

## 3. DateRangePicker Component

- [x] 3.1 Create `components/admin/DateRangePicker.tsx` (Client Component) with `from` and `to` date inputs defaulting to today
- [x] 3.2 On change, push updated `?from=&to=` URL params using `useRouter` to trigger page re-fetch

## 4. PeakHoursChart Component

- [x] 4.1 Create `components/admin/PeakHoursChart.tsx` accepting `data: { hour: number; orderCount: number }[]`
- [x] 4.2 Render native SVG with `viewBox="0 0 960 300"`, 24 bars linearly scaled to `orderCount`, and hour labels on x-axis

## 5. Dashboard Page

- [x] 5.1 Create `app/admin/dashboard/page.tsx` as a Server Component that reads `searchParams` for `from`/`to`
- [x] 5.2 Fetch summary, top products, and peak hours in parallel with `Promise.all`
- [x] 5.3 Render summary cards for `totalOrders`, `totalRevenue` (formatted currency), and `averageOrderValue` (formatted currency)
- [x] 5.4 Render top products table with columns: Product Name, Quantity Sold, Revenue
- [x] 5.5 Render `<DateRangePicker />` and `<PeakHoursChart />` with fetched data
