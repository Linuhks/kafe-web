## Context

The admin product listing (`/admin/products`) currently renders a generic Shadcn `DataTable` wrapped in a plain `<div>` with a heading. The Stitch reference design calls for a richer table UI: product thumbnails, colour-coded category badges, search + filter chips, and design-token–consistent typography. All data is already available server-side; this is a purely visual rework.

## Goals / Non-Goals

**Goals:**
- Align the product listing with the Kafe design system (kafe-* Tailwind tokens, typography scale, spacing tokens)
- Render product thumbnails in the table using the existing `productImage` / `imageUrl` field on `ProductResponseDto`
- Add client-side search (name substring) and category filter chips with no new API calls
- Keep existing toggle availability, edit, and delete interactions unchanged

**Non-Goals:**
- Server-side search or filtering (no URL param changes, no new API endpoints)
- Changes to the create/edit product forms
- Pagination UX changes beyond restyling the existing controls

## Decisions

### Keep `ProductsTable` as a client component
`ProductsTable` already uses `'use client'` for hooks (toggle, router). Adding local state for `searchQuery` and `activeCategory` keeps all filtering logic in one place without introducing a new component or lifting state to the page.

**Alternatives considered**: Server-side filtering via `?search=` + `?category=` URL params — rejected because the Stitch design implies instant client-side filtering and adding URL params would require wiring search into `getProducts` and re-fetching on each keystroke.

### Extend existing `ProductRow` interface rather than creating a new component
The `DataTable` generic is flexible but its column render API is enough to host the richer cells. No new primitive is needed — just updated `render` functions.

**Alternatives considered**: Extract a standalone `ProductsTableKafe.tsx` alongside the old one — rejected to avoid duplication; a clean rewrite of the existing file is lower maintenance.

### Category badge colours via a lookup map
Map category name → Tailwind background/text classes using the same colour tokens from the Stitch design (tertiary-fixed for Coffee Beans, secondary-fixed for Brewing Gear, primary-fixed for Subscription). Unknown categories fall back to `bg-kafe-surface-container text-kafe-on-surface-variant`.

### Product thumbnail with Next.js `<Image>` or `<img>`
Use a plain `<img>` for the thumbnail to avoid `next/image` domain configuration overhead. Render a fallback `<div>` with a coffee icon if `imageUrl` is absent.

## Risks / Trade-offs

- [Client-side filter only] → If the product list has many pages, filtering will only operate on the current page's data. Mitigation: acceptable for admin use; a future enhancement can add server-side search when the catalogue grows.
- [ProductsTable.test.tsx] → Existing tests assert on text content and classes that will change. Mitigation: tests are snapshot/behaviour-based; they will need updating but no new test infrastructure is required.
- [imageUrl field availability] → `ProductResponseDto` may not expose `imageUrl` if the API omits it. Mitigation: guard with optional chaining; fall back to icon placeholder.
