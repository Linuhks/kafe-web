## ADDED Requirements

### Requirement: Page header uses Kafe typography tokens
The categories page header SHALL use `text-headline-lg text-kafe-primary` for the `<h1>` and `text-body-md text-kafe-on-surface-variant` for the subtitle, matching the products page pattern.

#### Scenario: Header renders with Kafe tokens
- **WHEN** a user visits `/admin/categories`
- **THEN** the page title "Categorias" is rendered with `text-headline-lg text-kafe-primary` classes

### Requirement: CTA button matches products page style
The "Nova categoria" link SHALL be styled as `bg-kafe-primary text-kafe-on-primary px-6 py-3 rounded-lg text-label-sm hover:opacity-90 transition-opacity` with a `Plus` icon, using a plain `<Link>` element — no shadcn `Button` wrapper.

#### Scenario: CTA button renders without shadcn Button
- **WHEN** the categories page renders
- **THEN** the "Nova categoria" link does not use the shadcn `Button` component
- **THEN** the link has `bg-kafe-primary text-kafe-on-primary` classes applied directly

### Requirement: Table shell uses Kafe surface tokens
The `CategoriesTable` container SHALL use `bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl overflow-hidden shadow-sm` instead of `rounded-md border`.

#### Scenario: Table has Kafe surface styling
- **WHEN** the categories list is not empty
- **THEN** the table wrapper uses `bg-kafe-surface-container-lowest` and `border-kafe-outline-variant`

### Requirement: Table header row uses Kafe tokens
The `<thead>` row SHALL use `bg-kafe-surface-container-low border-b border-kafe-outline-variant`. Column headers SHALL use `text-label-sm text-kafe-on-surface-variant uppercase tracking-wider`.

#### Scenario: Column headers render with Kafe label tokens
- **WHEN** the table renders with categories
- **THEN** each `<th>` has `text-label-sm text-kafe-on-surface-variant uppercase tracking-wider` classes

### Requirement: Table body rows use Kafe hover tokens
Body rows SHALL use `hover:bg-kafe-surface-container-low transition-colors` and be separated by `divide-y divide-kafe-outline-variant` on the `<tbody>`.

#### Scenario: Row hover uses Kafe surface token
- **WHEN** a user hovers over a category row
- **THEN** the row background changes to `kafe-surface-container-low`

### Requirement: Status badge uses Kafe tokens
Active/inactive badges SHALL be rendered as inline `<span>` elements with Kafe tokens instead of shadcn `Badge`. Active: `bg-kafe-primary/10 text-kafe-primary`. Inactive: `bg-kafe-surface-container text-kafe-on-surface-variant`.

#### Scenario: Active category shows Kafe-styled badge
- **WHEN** a category has `isActive: true`
- **THEN** its status badge uses `bg-kafe-primary/10 text-kafe-primary` classes

#### Scenario: Inactive category shows Kafe-styled badge
- **WHEN** a category has `isActive: false`
- **THEN** its status badge uses `bg-kafe-surface-container text-kafe-on-surface-variant` classes

### Requirement: Action icon buttons use Kafe color tokens
The edit and delete icon buttons SHALL use `text-kafe-on-surface-variant` as base color, with `hover:text-kafe-primary` for edit and `hover:text-kafe-error` for delete, replacing shadcn `Button` ghost variants.

#### Scenario: Edit icon button has Kafe hover color
- **WHEN** a user hovers the edit (Pencil) icon for a category
- **THEN** the icon color transitions to `kafe-primary`

#### Scenario: Delete icon button has Kafe error hover color
- **WHEN** a user hovers the delete (Trash2) icon for a category
- **THEN** the icon color transitions to `kafe-error`

### Requirement: Empty state uses Kafe token
When no categories exist, the empty state message SHALL use `text-kafe-on-surface-variant` instead of `text-muted-foreground`.

#### Scenario: Empty state renders with Kafe token
- **WHEN** the categories list is empty
- **THEN** the empty message uses `text-kafe-on-surface-variant` class
