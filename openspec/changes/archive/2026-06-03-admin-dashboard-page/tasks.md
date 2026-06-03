## 1. API — Low-Stock Inventory Query

- [x] 1.1 Inspect `getInventoryItems` return shape to confirm whether a stock percentage or max-quantity field is available
- [x] 1.2 Implement or extend a `getInventoryAlerts()` function (in `lib/api/inventory` or `lib/api/dashboard`) that returns items with stock ≤ 20% capacity; fall back to quantity < 10 if percentage is unavailable
- [x] 1.3 Add the `getInventoryAlerts()` call into the `Promise.all` in `app/admin/dashboard/page.tsx`

## 2. Generate Report Button (Client Component)

- [x] 2.1 Create `components/admin/GenerateReportButton.tsx` — a `"use client"` button that renders the primary "Generate Report" button and shows a success toast on click
- [x] 2.2 Wire the toast using the existing toast primitive (or a lightweight inline implementation if none exists)

## 3. Dashboard In-Page Header

- [x] 3.1 Add a sticky `<header>` inside `app/admin/dashboard/page.tsx` with "Overview" title, formatted date line, notification bell icon with error-dot badge, and `<GenerateReportButton />`
- [x] 3.2 Apply Kafe tokens: `headline-lg` for title, `body-md`/`on-surface-variant` for date, `surface-container-lowest/50 backdrop-blur-md` background, `border-b border-outline-variant`

## 4. Summary Stat Cards

- [x] 4.1 Replace the existing three plain cards with Kafe-styled cards: `surface-container-lowest` background, `rounded-2xl`, `border-outline-variant/30` border
- [x] 4.2 Add icon containers (`secondary-container/30` tint, `rounded-xl`) with Material Symbols icons for each card
- [x] 4.3 Add percentage-change badges (green `trending_up` / red `trending_down`) — use static placeholder values until the API returns trend data

## 5. Best Selling Products Panel

- [x] 5.1 Wrap the existing top-products content in a bento-grid panel (`lg:col-span-7`, `rounded-3xl`, `border-outline-variant/30`)
- [x] 5.2 Implement the empty-state view: dashed-border container, bar-chart icon, "No sales data yet" heading, descriptive message, "Sync Point of Sale" text link — shown when `topProducts` is empty
- [x] 5.3 Retain the existing table/list rendering when `topProducts` is non-empty

## 6. Peak Hours Panel

- [x] 6.1 Wrap the existing `PeakHoursChart` in a bento-grid panel (`lg:col-span-5`, `rounded-3xl`, `border-outline-variant/30`)
- [x] 6.2 Implement the empty-state view: dashed-border container, clock icon, "Awaiting Hourly Traffic" heading, descriptive message — shown when `peakHours` data is empty
- [x] 6.3 Retain the existing SVG chart rendering when data is present

## 7. Inventory Alerts Widget

- [x] 7.1 Create `components/admin/DashboardInventoryAlerts.tsx` (or inline in page) rendering the alerts section: header with "Inventory Alerts" title and "N Items Critical" badge
- [x] 7.2 Render one row per alert: product thumbnail, name, quantity label, progress bar (width = stock %, error color at ≤ 15%, secondary-fixed-dim otherwise), "Restock Now" button linking to inventory route
- [x] 7.3 Hide the entire section when the alerts array is empty

## 8. Page Layout Assembly

- [x] 8.1 Compose the full redesigned page: sticky header → stat cards → bento-grid (products + peak hours) → inventory alerts → footer
- [x] 8.2 Apply overall page spacing: `p-margin-page space-y-stack-lg max-w-7xl mx-auto`
- [x] 8.3 Preserve the `DateRangePicker` — relocate it into the sticky header or keep below the header as a filter row

## 9. Verification

- [x] 9.1 Run `npm run build` (or `next build`) to confirm no TypeScript errors
- [x] 9.2 Visually compare the running page against the Stitch screenshot at `/tmp/stitch-kafe-admin/screenshot.png`
- [x] 9.3 Verify DateRangePicker still updates URL params and triggers re-fetch
- [x] 9.4 Verify Inventory Alerts section hides when no low-stock items are returned
