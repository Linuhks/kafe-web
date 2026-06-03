## MODIFIED Requirements

### Requirement: Admin can view the product list
The system SHALL display all products in a sortable, paginated table at `/admin/products`. Each row SHALL show: a product thumbnail (falling back to a placeholder icon if `imageUrl` is absent), product name and subtitle in `text-kafe-primary`, category as a colour-coded pill badge, price right-aligned in `text-[18px]`, availability as a toggle switch (active state uses `bg-kafe-primary`), and icon-only action buttons (edit, delete). The table SHALL be wrapped in a `bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl` container. A search input and category filter chips SHALL appear above the table and filter rows client-side.

#### Scenario: Product list renders server-side
- **WHEN** an admin navigates to `/admin/products`
- **THEN** the page renders with a product table pre-populated with products fetched on the server

#### Scenario: Admin sorts by column
- **WHEN** the admin clicks a sortable column header
- **THEN** the table re-orders rows by that column (ascending, then descending on second click)

#### Scenario: Admin paginates the list
- **WHEN** there are more products than the page size
- **THEN** pagination controls appear and navigating pages updates the visible rows and the URL `?page=N` param
