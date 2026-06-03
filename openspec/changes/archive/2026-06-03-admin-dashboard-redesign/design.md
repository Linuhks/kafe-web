## Context

The previous `admin-dashboard-page` change implemented the dashboard redesign using a sticky in-page header (with `sticky top-0 z-20 backdrop-blur-md`) and a 12-column bento grid (`lg:grid-cols-12` with `col-span-7`/`col-span-5`). The updated Stitch reference (screen `3ba024942eef4414a443f5f0f18581a5`) shows the header as a normal in-flow element and the bento grid as a simple 3-column layout. This is a pure presentation change — no data fetching, API, or routing changes are needed.

## Goals / Non-Goals

**Goals:**
- Remove the sticky overlay header and replace with an in-flow `<header>` inside the `p-kafe-margin-page` padded area
- Simplify the bento grid to `lg:grid-cols-3` with `col-span-2` / `col-span-1`
- Match stat card value typography to Stitch: `text-4xl font-bold` for the numeric value

**Non-Goals:**
- No changes to data fetching, date range behavior, or existing components (`DateRangePicker`, `PeakHoursChart`, `DashboardInventoryAlerts`, `GenerateReportButton`)
- No sidebar changes
- No new API calls

## Decisions

### Non-sticky header
The Stitch design intentionally places the header as a scrollable content element, not a sticky overlay. This removes the `z-index` layering complexity and the partially-transparent backdrop effect that clashes with the warm `#f8f6f5` background. The sticky header was added in the previous iteration based on an older Stitch version; the updated design removes it.

Alternatives considered: keeping sticky header, matching Stitch only for grid. Rejected — the header sticky behavior is visible and creates a different feel from the design target.

### Simplified grid (3-col instead of 12-col)
`lg:grid-cols-3 col-span-2 / col-span-1` achieves the same ~67%/~33% split as `lg:grid-cols-12 col-span-7/col-span-5` but with less markup noise. There is no semantic difference.

## Risks / Trade-offs

- **Inventory Alerts section not in Stitch**: The current page renders `<DashboardInventoryAlerts>` below the bento grid. The Stitch screen doesn't show it, but this is likely a viewport crop, not a removal. Keep the component in place.
- **Scroll behavior change**: Removing the sticky header means the title scrolls away on long pages. Acceptable — the admin dashboard is not long enough to require a persistent title anchor.
