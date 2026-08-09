## MODIFIED Requirements

### Requirement: Inventory list page with stock status badges
The system SHALL render `/admin/inventory` as a Server Component displaying a table of all ingredients. The table SHALL include columns: Nome, Unidade, Estoque atual, Estoque mínimo, Status, and Ações. The Status column SHALL show a badge: "OK" (green) when `currentStock >= minimumStock`, and "ESTOQUE BAIXO" (red/destructive) when `currentStock < minimumStock`. The Actions column SHALL include a "Reabastecer" button linking to `/admin/inventory/[id]/restock`.

#### Scenario: Page renders ingredient list with OK status
- **WHEN** an ADMIN user visits `/admin/inventory` and an ingredient has `currentStock >= minimumStock`
- **THEN** the ingredient row shows a green "OK" badge in the Status column

#### Scenario: Page renders ingredient with LOW STOCK status
- **WHEN** an ADMIN user visits `/admin/inventory` and an ingredient has `currentStock < minimumStock`
- **THEN** the ingredient row shows a red "ESTOQUE BAIXO" badge in the Status column

#### Scenario: Restock action navigates to restock form
- **WHEN** the admin clicks the "Reabastecer" button on an ingredient row
- **THEN** the browser navigates to `/admin/inventory/[id]/restock` for that ingredient

#### Scenario: Empty inventory list
- **WHEN** the backend returns no ingredients
- **THEN** the page renders the table with no rows and no error state
