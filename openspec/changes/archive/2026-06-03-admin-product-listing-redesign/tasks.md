## 1. Page Header

- [x] 1.1 Rewrite `app/admin/products/page.tsx` header section: two-column flex layout with title "Product Inventory" (`text-headline-lg text-kafe-primary`) + subtitle (`text-body-md text-kafe-on-surface-variant`) on the left, and "Add New Product" Link button (`bg-kafe-primary text-kafe-on-primary rounded-lg px-6 py-3 text-label-sm`) on the right

## 2. Table Wrapper & Header Row

- [x] 2.1 Wrap the table in `bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl overflow-hidden shadow-sm`
- [x] 2.2 Style `<thead>` row with `bg-kafe-surface-container-low border-b border-kafe-outline-variant` and header cells with `text-label-sm uppercase tracking-wider text-kafe-on-surface-variant`

## 3. Product Name Cell

- [x] 3.1 Update the `name` column `render` in `ProductsTable.tsx` to show a 48 × 48 px `<img>` thumbnail (`rounded object-cover border border-kafe-outline-variant flex-shrink-0`) using `row.imageUrl` when present
- [x] 3.2 Add a fallback `<div>` with a coffee icon (material symbol or lucide) when `imageUrl` is absent
- [x] 3.3 Add `imageUrl` to the `ProductRow` interface and map it from `ProductResponseDto` in the `rows` mapping
- [x] 3.4 Style the product name as `text-[18px] text-kafe-primary font-semibold` and add a subtitle line (`text-label-sm text-kafe-on-surface-variant`) showing the category name

## 4. Category Badge Cell

- [x] 4.1 Define a `CATEGORY_BADGE_STYLES` map: `{ "Coffee Beans": "bg-tertiary-fixed text-on-tertiary-fixed-variant", "Brewing Gear": "bg-secondary-fixed text-on-secondary-fixed-variant", "Subscription": "bg-primary-fixed text-on-primary-fixed-variant" }` with a default fallback
- [x] 4.2 Update the `categoryName` column `render` to use the map and render a `rounded px-3 py-1 text-sm` pill badge

## 5. Availability Toggle

- [x] 5.1 Update the toggle button class in the `isAvailable` column `render` to use `bg-kafe-primary` when active (replacing the generic `bg-primary`)

## 6. Action Buttons

- [x] 6.1 Update edit button hover class to `hover:text-kafe-primary`
- [x] 6.2 Update delete button hover class to `hover:text-kafe-error`

## 7. Search Input & Category Filter Chips

- [x] 7.1 Add `searchQuery` and `activeCategory` state (both `useState`) to `ProductsTable`
- [x] 7.2 Render a search input above the table: search icon on the left, placeholder "Search beans, equipment…", styled with `border border-kafe-outline-variant rounded-lg focus:border-kafe-primary`
- [x] 7.3 Render category filter chips row: "All Items", "Coffee Beans", "Brewing Gear", "Gifts" as `rounded-full px-4 py-2 text-label-sm` buttons; active chip gets `bg-kafe-primary text-kafe-on-primary`, inactive gets `bg-kafe-surface-container-lowest border border-kafe-outline-variant text-kafe-on-surface-variant`
- [x] 7.4 Derive `filteredRows` from `rows` by applying `searchQuery` (case-insensitive name substring) and `activeCategory` (exact category match, skip if "All Items") before passing to `DataTable`

## 8. Pagination Bar

- [x] 8.1 Verify the existing `DataTable` pagination renders within the `bg-kafe-surface-container-low border-t border-kafe-outline-variant` footer area; update `DataTable` pagination wrapper classes if needed

## 9. Tests

- [x] 9.1 Update `ProductsTable.test.tsx` — adjust any assertions that reference old class names or missing thumbnail elements to match the new structure
