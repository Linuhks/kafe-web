## ADDED Requirements

### Requirement: Dashboard inventory alerts widget
The system SHALL display an "Inventory Alerts" section on the admin dashboard showing items whose stock level is at or below 20% of capacity. Each row SHALL show: a product thumbnail, product name, current stock quantity label, a horizontal progress bar filled proportionally to the stock percentage, and a "Restock Now" button that navigates to the inventory admin route for that item. When no items are below the threshold, the section SHALL be hidden.

#### Scenario: Low-stock items displayed
- **WHEN** the dashboard loads and at least one product has stock ≤ 20% of capacity
- **THEN** the Inventory Alerts section is visible with one row per low-stock item, each showing name, quantity, progress bar, and Restock Now button

#### Scenario: No low-stock items
- **WHEN** the dashboard loads and no products are below the stock threshold
- **THEN** the Inventory Alerts section is not rendered

#### Scenario: Progress bar reflects stock level
- **WHEN** a product has 10% stock remaining
- **THEN** its progress bar fill width is 10% and rendered in the error color token

#### Scenario: Restock Now navigates to inventory
- **WHEN** an admin clicks "Restock Now" on an alert row
- **THEN** the browser navigates to the inventory admin route for that product

#### Scenario: Alert count badge shows number of critical items
- **WHEN** the Inventory Alerts section renders with N low-stock items
- **THEN** a badge in the section header displays "N Items Critical"
