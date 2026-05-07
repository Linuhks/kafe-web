## ADDED Requirements

### Requirement: Movement history page with filters and pagination
The system SHALL render `/admin/inventory/movements` as a Server Component displaying a paginated table of stock movements. The table SHALL include columns: Ingredient, Type, Quantity, Note, Order ID (if present), and Created At (formatted timestamp). The page SHALL provide a date range filter (from/to date inputs) and an ingredient filter (select dropdown populated from the full ingredient list). Filters SHALL be applied client-side via URL search params. The movements table SHALL be paginated using the existing Pagination component.

#### Scenario: Page renders movement history
- **WHEN** an ADMIN user visits `/admin/inventory/movements`
- **THEN** the movements table renders with all columns and the most recent movements displayed

#### Scenario: Date range filter restricts visible movements
- **WHEN** the admin selects a from/to date range
- **THEN** only movements with `createdAt` within the selected range are shown in the table

#### Scenario: Ingredient filter restricts visible movements
- **WHEN** the admin selects a specific ingredient from the filter dropdown
- **THEN** only movements for that ingredient are shown in the table

#### Scenario: Filters combine correctly
- **WHEN** both date range and ingredient filter are applied simultaneously
- **THEN** the table shows only movements matching both filters

#### Scenario: Order ID column shows link or dash
- **WHEN** a movement has an `orderId`
- **THEN** the Order ID column displays the order ID value

#### Scenario: Movement with no order ID
- **WHEN** a movement has no `orderId` (manual restock)
- **THEN** the Order ID column displays a dash or empty placeholder

#### Scenario: Pagination navigates movement pages
- **WHEN** there are more movements than the page limit
- **THEN** the Pagination component is visible and navigating pages loads the next set of movements
