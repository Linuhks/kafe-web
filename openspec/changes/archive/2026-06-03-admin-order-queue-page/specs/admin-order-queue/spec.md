## ADDED Requirements

### Requirement: Admin can view the order queue
The system SHALL provide a page at `/admin/orders` displaying all active orders in a bento-style card grid with Kafe design system styling.

#### Scenario: Page renders with active orders
- **WHEN** an admin navigates to `/admin/orders`
- **THEN** the page title "Fila de pedidos" is displayed and order cards are shown in a responsive grid

#### Scenario: Page shows empty state
- **WHEN** there are no active orders
- **THEN** a message "Nenhum pedido ativo no momento." is displayed in place of the grid

#### Scenario: Page shows skeleton while loading
- **WHEN** the order data is being fetched
- **THEN** skeleton placeholder cards are displayed in the grid

### Requirement: Admin can filter orders by status
The system SHALL display filter tabs that filter the visible order cards by status.

#### Scenario: Default view shows all active orders
- **WHEN** the page loads
- **THEN** the "Todos" tab is active and all orders with status RECEIVED or IN_PREPARATION are shown

#### Scenario: Filtering by Recebidos
- **WHEN** admin clicks the "Recebidos" tab
- **THEN** only orders with status RECEIVED are shown

#### Scenario: Filtering by Em preparo
- **WHEN** admin clicks the "Em preparo" tab
- **THEN** only orders with status IN_PREPARATION are shown

#### Scenario: Tab shows live count
- **WHEN** orders are loaded
- **THEN** each filter tab label includes the count of matching orders in parentheses

### Requirement: Admin can advance an order's status
The system SHALL allow the admin to advance an order through its lifecycle via action buttons on each card.

#### Scenario: Initiate preparation for a received order
- **WHEN** admin clicks "Iniciar preparo" on a RECEIVED order
- **THEN** the order status is updated to IN_PREPARATION and the card reflects the new status

#### Scenario: Mark an in-preparation order as ready
- **WHEN** admin clicks "Marcar como pronto" on an IN_PREPARATION order
- **THEN** the order status is updated to READY and the card is removed from the active queue

#### Scenario: Action button is disabled while updating
- **WHEN** a status update request is in-flight for an order
- **THEN** that order's action button is disabled and shows a loading state

### Requirement: Admin can search orders by customer name
The system SHALL provide a search input in the page header that filters the order grid by customer name.

#### Scenario: Search narrows visible cards
- **WHEN** admin types a name into the search field
- **THEN** only order cards whose customer name contains the typed string (case-insensitive) are shown

#### Scenario: Clearing search restores full list
- **WHEN** admin clears the search field
- **THEN** all orders matching the current status filter tab are shown again

### Requirement: Footer displays queue statistics
The system SHALL display a statistics footer at the bottom of the page showing operational metrics.

#### Scenario: Order count is shown
- **WHEN** orders are loaded
- **THEN** the footer shows the count of orders currently in the active queue

#### Scenario: Team avatars are shown
- **WHEN** the page is displayed
- **THEN** the footer shows placeholder team member avatars (B1, B2, CZ) with the label "Equipe ativa na operação"
