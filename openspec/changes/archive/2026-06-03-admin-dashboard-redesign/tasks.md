## 1. Header — Remove Sticky Overlay

- [x] 1.1 In `app/admin/dashboard/page.tsx`, remove the outer `<div className="min-h-screen bg-...">` wrapper and the `<header className="sticky top-0 z-20 ...">` element
- [x] 1.2 Move the header content (title, date, notification bell, `<GenerateReportButton />`) into a non-sticky `<header className="flex justify-between items-start mb-8">` inside the `p-kafe-margin-page` content div

## 2. Stat Cards — Typography Alignment

- [x] 2.1 Change the stat card value `<p>` from `text-headline-lg` to `text-4xl font-bold text-on-surface` to match the Stitch reference

## 3. Bento Grid — Simplify Layout

- [x] 3.1 Change the bento grid container from `lg:grid-cols-12` to `lg:grid-cols-3`
- [x] 3.2 Update Best Selling Products panel from `lg:col-span-7` to `lg:col-span-2`
- [x] 3.3 Update Peak Hours panel from `lg:col-span-5` to remove the explicit `col-span` (defaults to 1 in a 3-col grid) or set `lg:col-span-1`

## 4. Verification

- [x] 4.1 Run `pnpm build` and confirm zero TypeScript errors
- [x] 4.2 Start dev server and visually compare `/admin/dashboard` against the Stitch screenshot at `/tmp/stitch-admin-dashboard/screenshot.png`
- [x] 4.3 Confirm the header scrolls with the page (not sticky)
- [x] 4.4 Confirm `DateRangePicker` still updates URL params and triggers re-fetch
