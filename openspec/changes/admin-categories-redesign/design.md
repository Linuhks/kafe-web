## Context

The Admin Categories page (`app/admin/categories/page.tsx` + `components/admin/CategoriesTable.tsx`) has working CRUD but hasn't received the Kafe design-system polish applied to Dashboard and Products. The redesign is purely presentational — no API surface changes, no new routes, no new dependencies.

## Goals / Non-Goals

**Goals:**
- Apply consistent Kafe design tokens (spacing, typography, badge shape) to the categories table
- Add a category icon avatar column (lucide-react icon, single generic icon for all categories)
- Align Actions column to the right; center Order column
- Add table footer with displayed-count label and prev/next pagination buttons
- Add two bento cards below the table: a static Organization Tip card and a Total Items stat card (shows total category count, the only count available without extra API calls)

**Non-Goals:**
- Per-category icon customization (no icon field in API DTO)
- Sidebar changes
- API changes or new data fetching
- Pagination logic (footer buttons are rendered but categories list is already complete from server fetch)

## Decisions

**Use `Tag` (lucide-react) as the category icon avatar**
All categories share one icon since `CategoryResponseDto` has no icon field. `Tag` is semantically appropriate for a category. Rendered in a `w-10 h-10 rounded-lg bg-secondary-container` wrapper with `text-kafe-primary`, matching the Stitch design pattern.

**Total Items card shows category count, not product count**
The Stitch mockup shows 42 "total items distributed across categories" — implying a product count. That number requires an extra API call not present on this page. Using `categories.length` avoids a new fetch and keeps the server component lean. The card label will read "Total Categories" to be accurate.

**Pagination buttons are decorative (disabled) for now**
The API returns all categories in one page. The footer prev/next buttons match the design but are always disabled until the API supports pagination.

**No new dependencies**
Icon from `lucide-react` (already installed). All tokens already in `globals.css`. No new `components/ui/` primitives needed.

## Risks / Trade-offs

- [Risk] `Tag` icon may feel generic → Mitigation: consistent with how other admin tables (Products) use icon avatars; acceptable until icon customization is a product requirement
- [Risk] "Total Categories" label diverges from design's "Total Items" → Mitigation: more accurate; can be changed when product count API is available

## Migration Plan

No migration needed. Pure UI change, no data model or route changes. Deployable in a single PR.
