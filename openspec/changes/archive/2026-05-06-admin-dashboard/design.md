## Context

The admin section is the last major unbuilt area of the app. The barista queue is live; the public catalog and cart are live; the auth middleware already gates `/admin/*` to ADMIN-only. The backend already exposes analytics endpoints. This change introduces the admin layout shell and the first admin page.

All data fetching on the dashboard is done server-side (Next.js Server Components), keeping client JS small. The only client-interactive piece is the date range filter, which communicates via URL search params so the server re-fetches on navigation.

## Goals / Non-Goals

**Goals:**
- Admin sidebar layout that will host all future admin pages
- Dashboard page with three analytics widgets: summary cards, top-products table, peak-hours SVG chart
- Date range filtering via URL params (no client-side state leakage)
- Zero new chart libraries — SVG is rendered manually

**Non-Goals:**
- Subsequent admin pages (Products, Categories, Users, Inventory) — those are separate tasks
- Real-time / WebSocket updates — polling is not needed for analytics
- Persisting date range between sessions — URL params reset on new tabs

## Decisions

**Server Component for the page, Client Component only for DateRangePicker**
All three data fetches (`summary`, `top-products`, `peak-hours`) run in parallel via `Promise.all` in the Server Component. Sending them all at once removes any waterfall. The DateRangePicker is the only interactive element and is isolated to its own Client Component that pushes params to the URL with `router.push`.

**Native SVG for PeakHoursChart over a chart library**
The task spec explicitly requires this. A chart library (recharts, chart.js) would be ~40–80 KB extra JS and introduce a dependency to maintain. The chart is a simple bar chart; linear scaling from `orderCount` is trivial with SVG.

**`lib/api/dashboard.ts` typed wrappers over inline `fetch`**
The generated Orval client covers product/order CRUD. The analytics endpoints are server-side-only calls (not exposed via React Query hooks to clients). A small typed wrapper in `lib/api/` keeps the page clean and follows the existing pattern in `lib/api/`.

**Date range default: today**
Defaulting to "today" keeps the first load meaningful without requiring user input. The URL param names are `from` and `to` (ISO date strings).

## Risks / Trade-offs

- [SVG chart hardcodes hours 0–23] → If the backend ever adds hour-level granularity beyond 24h, the scale logic needs updating. Mitigation: componentize the scale function.
- [No loading skeleton for analytics widgets] → On slow connections, the page will be blank until all three fetches resolve. Mitigation: Suspense boundaries with Skeleton fallbacks can be added later without redesign.
- [Admin sidebar is shipping empty links] → Products, Categories, Users, Inventory links will 404 until those pages are built. Mitigation: mark them visually as "coming soon" or disable them.
