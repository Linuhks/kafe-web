## ADDED Requirements

### Requirement: Categories table has icon avatar in Name column
Each table row SHALL display a `w-10 h-10 rounded-lg bg-secondary-container` icon avatar containing a `Tag` icon from `lucide-react` (`text-kafe-primary`), followed by the category name in `text-[18px] font-semibold text-kafe-primary`.

#### Scenario: Name column renders icon + name
- **WHEN** categories are loaded and rendered in the table
- **THEN** each row shows a square icon avatar on the left of the category name text

### Requirement: Status badge uses pill shape
Active and Inactive badges SHALL use `rounded-full` (pill shape) instead of `rounded`, with `text-[12px] uppercase font-semibold` text.
Active badge: `bg-status-ready/15 text-status-ready`. Inactive badge: `bg-kafe-surface-container text-kafe-on-surface-variant`.

#### Scenario: Active category shows green pill badge
- **WHEN** `cat.isActive` is `true`
- **THEN** the status cell shows a pill-shaped green badge with text "Active"

#### Scenario: Inactive category shows muted pill badge
- **WHEN** `cat.isActive` is `false`
- **THEN** the status cell shows a pill-shaped muted badge with text "Inactive"

### Requirement: Actions column is right-aligned
The Actions `<th>` SHALL have `text-right` and each Actions `<td>` SHALL have `text-right`. Edit and delete icon buttons SHALL have `hover:bg-surface-container-high` background on hover.

#### Scenario: Actions column layout
- **WHEN** viewing the categories table
- **THEN** edit and delete buttons are right-aligned in each row, with background highlight on hover

### Requirement: Order column is centered
The Order `<th>` SHALL have `text-center` and the Order `<td>` SHALL have `text-center`.

#### Scenario: Order column centered
- **WHEN** viewing the categories table
- **THEN** the sortOrder value is displayed centered horizontally

### Requirement: Table footer shows item count and pagination controls
Below the `<tbody>`, the table container SHALL have a footer row with `bg-kafe-surface-container-low border-t border-kafe-outline-variant` styling. Left side: `"Showing X categories"` count label. Right side: prev/next `ChevronLeft`/`ChevronRight` icon buttons (`p-2 rounded-lg border border-kafe-outline-variant`), always disabled while server-side pagination is not implemented.

#### Scenario: Footer displays category count
- **WHEN** categories are loaded
- **THEN** the footer shows "Showing N categories" where N equals the total number of categories

#### Scenario: Pagination buttons are disabled
- **WHEN** viewing the categories table
- **THEN** both prev and next buttons are rendered but visually disabled (`disabled opacity-30`)

### Requirement: Page has two bento cards below the table
The categories page (`app/admin/categories/page.tsx`) SHALL render two cards in a responsive grid (`grid-cols-1 lg:grid-cols-3`) below the table:
1. **Organization Tip card** (`col-span-2`, `bg-kafe-primary rounded-3xl p-8`): Dark brown card with white headline "Organization Tips", body text about category naming best practice, and a large decorative `BookOpen` icon (lucide-react, `opacity-10`, absolute positioned bottom-right).
2. **Total Categories card** (`col-span-1`, `bg-secondary-container rounded-3xl p-8`): Shows a `BarChart3` icon, "Total Categories" headline, the numeric count of categories in large bold text, and a subtitle "Across all menu sections".

#### Scenario: Bento cards render below the table
- **WHEN** the categories page loads
- **THEN** two side-by-side cards appear below the categories table: a dark tip card and a light stats card

#### Scenario: Total Categories card shows correct count
- **WHEN** categories are fetched server-side
- **THEN** the stats card displays the length of the categories array as the total count
