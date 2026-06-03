## Context

The admin section was migrated to the Kafe design system, but the categories pages were left behind. The products page (`/admin/products`) is the reference implementation: it uses Kafe typography tokens (`text-headline-lg`, `text-body-md`), Kafe color tokens (`text-kafe-primary`, `bg-kafe-primary`, `text-kafe-on-surface-variant`), and a table styled with `bg-kafe-surface-container-lowest`, `border-kafe-outline-variant`, `divide-kafe-outline-variant`, and Kafe label tokens for column headers.

The categories page still uses `text-2xl font-bold`, `shadcn Button`, `rounded-md border`, `bg-muted/50`, and `hover:bg-muted/30`.

## Goals / Non-Goals

**Goals:**
- Align `app/admin/categories/page.tsx` header and CTA button with the products page pattern
- Align `components/admin/CategoriesTable.tsx` table shell, header row, body rows, badges, and icon buttons with Kafe tokens

**Non-Goals:**
- Adding search/filter/sort controls (not present in the current categories table)
- Adding pagination (categories list is unbounded but small)
- Changing any business logic, API calls, or delete flow

## Decisions

**Mirror products page structure, not pixel-perfect copy.**
The categories table has fewer columns and no thumbnail; the row layout will match spirit (Kafe tokens) without forcing identical columns. The action icon buttons (Pencil, Trash) are ghost-style — they can stay but styled with `text-kafe-on-surface-variant hover:text-kafe-primary` / `hover:text-kafe-error` instead of shadcn variants.

**Remove shadcn `Button` and `Badge` from the page and table.**
The page CTA becomes a plain `<Link>` with `bg-kafe-primary text-kafe-on-primary` inline styles (identical to the products page). The status badge becomes a small inline `<span>` with Kafe surface/color tokens, removing the shadcn `Badge` dependency from this component.

**Keep `'use client'` boundary in `CategoriesTable`.**
The table needs `useState` for the delete modal and `useRouter` for refresh — no change to the rendering model.

## Risks / Trade-offs

- `shadcn Button` `size="icon-sm"` is a non-standard size variant — it exists in this repo's shadcn config, but removing it here in favor of a plain `<button>` with Kafe classes avoids the dependency without requiring a config change.
- The empty state currently uses `text-muted-foreground`; it will be updated to `text-kafe-on-surface-variant` for token consistency, a purely visual change.
