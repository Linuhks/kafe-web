## Why

The Admin Categories page exists but lacks the polished Kafe design system treatment applied to other admin pages (Dashboard, Products). The table is functional but visually inconsistent — no category icons, unstyled status badges, no item count footer, and no contextual stats. This redesign aligns Categories with the established admin visual language.

## What Changes

- **CategoriesTable**: Add icon avatar per row, update status badge to pill shape (`rounded-full`), right-align Actions column, add table footer showing item count and pagination controls
- **categories page layout**: Wrap content in `p-kafe-margin-page` page padding, update header button to `rounded-xl` matching design, add two bento cards below the table (Organization Tip + Total Items count)
- All visible text kept in English per project conventions

## Capabilities

### New Capabilities

- `admin-categories-ui`: Full UI spec for the Admin Categories management page — table structure, row layout (icon + name), status badges, action buttons, footer pagination, and bento stat/tip cards

### Modified Capabilities

<!-- none -->

## Impact

- `app/admin/categories/page.tsx` — layout padding, header button style, new bento cards below table
- `components/admin/CategoriesTable.tsx` — icon column, status badge, action button hover states, footer with count + pagination
- No API changes; no new dependencies
