## ADDED Requirements

### Requirement: Product listing displays a design-system–consistent page header
The system SHALL render the `/admin/products` page header with a left column containing the title "Product Inventory" in `text-headline-lg text-kafe-primary` and a descriptive subtitle in `text-body-md text-kafe-on-surface-variant`, and a right column containing the "Add New Product" CTA button styled as `bg-kafe-primary text-kafe-on-primary rounded-lg`.

#### Scenario: Header renders with title and CTA
- **WHEN** an admin navigates to `/admin/products`
- **THEN** the page displays "Product Inventory" as the heading and an "Add New Product" button aligned to the right

### Requirement: Product listing table uses Kafe design tokens
The system SHALL render the products table inside a `bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl` wrapper, with a `bg-kafe-surface-container-low` header row and `text-label-sm uppercase tracking-wider text-kafe-on-surface-variant` header cells.

#### Scenario: Table container has correct visual treatment
- **WHEN** the products table is rendered
- **THEN** the outer wrapper has rounded corners, a border in `kafe-outline-variant`, and a contrasting header row background

### Requirement: Product name cell displays a thumbnail, name, and subtitle
The system SHALL render the product name table cell with a 48 × 48 px thumbnail (`rounded`, `object-cover`, `border border-kafe-outline-variant`). If `imageUrl` is absent, a fallback icon placeholder SHALL be shown. The product name SHALL be styled in `text-[18px] text-kafe-primary font-semibold`. A subtitle line with roast/type information SHALL appear below the name in `text-label-sm text-kafe-on-surface-variant`.

#### Scenario: Product with image URL renders thumbnail
- **WHEN** the product has a non-empty `imageUrl`
- **THEN** an `<img>` element with that src is rendered in the product name cell

#### Scenario: Product without image URL renders placeholder
- **WHEN** the product has no `imageUrl`
- **THEN** a fallback `<div>` with a coffee icon is shown in place of the thumbnail

### Requirement: Category cell renders a colour-coded pill badge
The system SHALL render the category name inside a `rounded px-3 py-1 text-sm` pill badge. The badge colour SHALL map as: "Coffee Beans" → `bg-tertiary-fixed text-on-tertiary-fixed-variant`; "Brewing Gear" → `bg-secondary-fixed text-on-secondary-fixed-variant`; "Subscription" → `bg-primary-fixed text-on-primary-fixed-variant`; other → `bg-kafe-surface-container text-kafe-on-surface-variant`.

#### Scenario: Coffee Beans category badge uses tertiary-fixed colours
- **WHEN** a product row has category "Coffee Beans"
- **THEN** the badge renders with `bg-tertiary-fixed` background

#### Scenario: Unknown category badge uses neutral colours
- **WHEN** a product row has a category not in the predefined map
- **THEN** the badge renders with `bg-kafe-surface-container` background

### Requirement: Availability toggle uses kafe-primary colour when active
The system SHALL render the availability toggle with `bg-kafe-primary` background when `isAvailable` is `true` and `bg-input` (or `bg-kafe-outline-variant`) when `false`.

#### Scenario: Active toggle is kafe-primary coloured
- **WHEN** `isAvailable` is `true`
- **THEN** the toggle thumb track has `bg-kafe-primary` applied

### Requirement: Action buttons use icon-only ghost style with kafe hover colours
The system SHALL render edit and delete action buttons as icon-only ghost buttons. The edit button SHALL apply `hover:text-kafe-primary` and the delete button SHALL apply `hover:text-kafe-error` on hover.

#### Scenario: Edit button hover shows primary colour
- **WHEN** the admin hovers over the edit button in a product row
- **THEN** the icon colour transitions to `text-kafe-primary`

### Requirement: Product listing has a search input and category filter chips
The system SHALL render a search input (with a search icon, placeholder "Search beans, equipment…") and a row of category filter chips ("All Items", "Coffee Beans", "Brewing Gear", "Gifts") above the table. Selecting a chip SHALL filter the visible rows client-side. Entering text in the search input SHALL filter rows by product name substring (case-insensitive), client-side.

#### Scenario: Typing in search filters visible rows
- **WHEN** the admin types "grinder" in the search input
- **THEN** only rows whose product name contains "grinder" (case-insensitive) are shown

#### Scenario: Selecting a category chip filters rows
- **WHEN** the admin clicks the "Coffee Beans" chip
- **THEN** only rows whose category is "Coffee Beans" are visible and the chip is styled as active (`bg-kafe-primary text-kafe-on-primary`)

#### Scenario: Active chip is visually distinct
- **WHEN** a category chip is selected
- **THEN** it renders with `bg-kafe-primary text-kafe-on-primary` and other chips render with outline/surface styles

#### Scenario: All Items chip shows all rows
- **WHEN** the admin clicks the "All Items" chip
- **THEN** all rows are shown regardless of category
