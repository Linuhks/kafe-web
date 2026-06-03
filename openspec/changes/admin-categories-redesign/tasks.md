## 1. Update CategoriesTable component

- [x] 1.1 Add `Tag`, `ChevronLeft`, `ChevronRight` imports from `lucide-react` to `CategoriesTable.tsx`
- [x] 1.2 Add icon avatar (`w-10 h-10 rounded-lg bg-secondary-container`) with `Tag` icon to the Name column cell
- [x] 1.3 Update Name column text to `text-[18px] font-semibold text-kafe-primary`
- [x] 1.4 Add `text-center` to Order `<th>` and Order `<td>`
- [x] 1.5 Update status badge: Active → `bg-status-ready/15 text-status-ready rounded-full text-[12px] uppercase font-semibold` with text "Active"; Inactive → `bg-kafe-surface-container text-kafe-on-surface-variant rounded-full text-[12px] uppercase` with text "Inactive"
- [x] 1.6 Add `text-right` to Actions `<th>` and `justify-end` to the actions button container in `<td>`
- [x] 1.7 Add `hover:bg-surface-container-high` to edit and delete icon buttons
- [x] 1.8 Add table footer below `</table>`: left side shows "Showing N categories" count; right side shows disabled `ChevronLeft`/`ChevronRight` buttons with `p-2 rounded-lg border border-kafe-outline-variant disabled:opacity-30`

## 2. Update categories page layout and bento cards

- [x] 2.1 Change page wrapper padding from `p-6` to `p-kafe-margin-page` in `app/admin/categories/page.tsx`
- [x] 2.2 Update "New Category" button: change `rounded-lg` to `rounded-xl`, ensure icon is `Plus` from lucide-react (already in place)
- [x] 2.3 Add `BookOpen`, `BarChart3` imports from `lucide-react` to the page file
- [x] 2.4 Add bento grid section below `<CategoriesTable>`: `mt-kafe-stack-lg grid grid-cols-1 lg:grid-cols-3 gap-6`
- [x] 2.5 Add Organization Tip card (`col-span-2 lg:col-span-2`, `bg-kafe-primary rounded-3xl p-8 relative overflow-hidden`): white "Organization Tips" headline, body text, and `BookOpen` icon decorative element (absolute, bottom-right, `opacity-10 text-[200px]`)
- [x] 2.6 Add Total Categories card (`bg-secondary-container rounded-3xl p-8 flex flex-col items-center text-center`): `BarChart3` icon, "Total Categories" headline, `{categories.length}` bold number in large text, subtitle "Across all menu sections"

## 3. Verify

- [x] 3.1 Confirm TypeScript builds without errors (`pnpm build` or `pnpm tsc --noEmit`)
- [ ] 3.2 Visit `/admin/categories` and confirm table, footer, and bento cards render as designed
