## Why

The admin dashboard page (`app/admin/dashboard/page.tsx`) was redesigned in the previous `admin-dashboard-page` change, but the Stitch reference has been updated (screen `3ba024942eef4414a443f5f0f18581a5`). The current implementation uses a sticky backdrop-blur header and a 12-column bento grid; the new design specifies a non-sticky in-flow header and a simpler 3-column grid, which improves scannability and removes the visual layer complexity that the sticky overlay added.

## What Changes

- Remove the sticky/backdrop-blur in-page header; replace with a non-sticky `<header>` rendered inside the main content padding area
- Move the "Overview" title + date + notification bell + Generate Report button into the in-flow header
- Update the bento grid from `lg:grid-cols-12` (`col-span-7` / `col-span-5`) to `lg:grid-cols-3` (`col-span-2` / `col-span-1`) — same visual proportions, simpler markup
- Tighten the stat card spacing to match the Stitch reference (gap-6, larger value text at `text-4xl font-bold`)
- Keep the DateRangePicker row directly below the header (`flex justify-end`), unchanged in behavior

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `admin-dashboard`: Header is no longer sticky; layout structure of the bento grid is simplified

## Impact

- `app/admin/dashboard/page.tsx` — header and bento-grid markup updated
- No API, route, or component interface changes
