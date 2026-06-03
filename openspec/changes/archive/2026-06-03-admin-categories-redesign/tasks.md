## 1. Page Header and CTA Button

- [x] 1.1 Update `app/admin/categories/page.tsx`: replace `text-2xl font-bold` with `text-headline-lg text-kafe-primary` on `<h1>`
- [x] 1.2 Add subtitle `<p>` with `text-body-md text-kafe-on-surface-variant` below the heading
- [x] 1.3 Replace shadcn `Button asChild` + `Link` with a plain `<Link>` using `bg-kafe-primary text-kafe-on-primary px-6 py-3 rounded-lg text-label-sm hover:opacity-90 transition-opacity` and `Plus` icon
- [x] 1.4 Remove `Button` import from `@/components/ui/button` in the page file

## 2. Table Shell and Header

- [x] 2.1 In `CategoriesTable.tsx`, change the wrapper `div` from `rounded-md border` to `bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl overflow-hidden shadow-sm`
- [x] 2.2 Change `<thead>` row from `border-b bg-muted/50` to `bg-kafe-surface-container-low border-b border-kafe-outline-variant`
- [x] 2.3 Update all `<th>` elements: replace generic `font-medium` with `text-label-sm text-kafe-on-surface-variant uppercase tracking-wider`

## 3. Table Body Rows

- [x] 3.1 Change `<tbody>` to add `divide-y divide-kafe-outline-variant` and remove per-row `border-b last:border-0`
- [x] 3.2 Change row hover from `hover:bg-muted/30` to `hover:bg-kafe-surface-container-low transition-colors`
- [x] 3.3 Update `text-muted-foreground` on description and sortOrder cells to `text-kafe-on-surface-variant`

## 4. Status Badge

- [x] 4.1 Replace shadcn `Badge` (active) with `<span className="inline-block rounded px-3 py-1 text-sm bg-kafe-primary/10 text-kafe-primary">`
- [x] 4.2 Replace shadcn `Badge variant="secondary"` (inactive) with `<span className="inline-block rounded px-3 py-1 text-sm bg-kafe-surface-container text-kafe-on-surface-variant">`
- [x] 4.3 Remove `Badge` import from `@/components/ui/badge` in `CategoriesTable.tsx`

## 5. Action Icon Buttons

- [x] 5.1 Replace edit `Button size="icon-sm" variant="ghost" asChild` with a plain `<Link>` wrapping a `<button className="p-2 text-kafe-on-surface-variant hover:text-kafe-primary transition-colors rounded">`
- [x] 5.2 Replace delete `Button size="icon-sm" variant="ghost"` with a plain `<button className="p-2 text-kafe-on-surface-variant hover:text-kafe-error transition-colors rounded">`
- [x] 5.3 Remove `Button` import from `@/components/ui/button` in `CategoriesTable.tsx`

## 6. Empty State

- [x] 6.1 Update empty state `div`: replace `text-muted-foreground` with `text-kafe-on-surface-variant`
