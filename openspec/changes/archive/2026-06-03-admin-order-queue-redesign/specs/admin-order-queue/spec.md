## MODIFIED Requirements

### Requirement: Admin can view the order queue
The system SHALL provide a page at `/admin/orders` displaying all active orders in a three-column Kanban board with Kafe design system styling. Columns are **Recebidos**, **Em Preparo**, and **Concluídos**, each showing a count badge. The Concluídos column displays a static archived empty-state; it does not show individual completed order cards.

#### Scenario: Page renders with active orders
- **WHEN** an admin navigates to `/admin/orders`
- **THEN** the page title "Fila de pedidos" is displayed and order cards appear in the Recebidos and Em Preparo columns according to their status

#### Scenario: Page shows empty state
- **WHEN** there are no active orders
- **THEN** a message "Nenhum pedido ativo no momento." is displayed in place of the Kanban board

#### Scenario: Page shows skeleton while loading
- **WHEN** the order data is being fetched
- **THEN** skeleton placeholder cards are displayed in the Recebidos and Em Preparo columns

#### Scenario: Order card shows customer note
- **WHEN** an order has a customer note
- **THEN** the note is displayed on the card in a shaded bubble below the item list

### Requirement: Admin can filter orders by category
The system SHALL display a filter toolbar with category tabs: "Todos os Pedidos", "Expressos", and "Lanches".

#### Scenario: Default view shows all active orders
- **WHEN** the page loads
- **THEN** the "Todos os Pedidos" tab is active and all orders with status RECEIVED or IN_PREPARATION are shown across the Kanban columns

#### Scenario: Filtering by Expressos
- **WHEN** admin clicks the "Expressos" tab
- **THEN** only orders belonging to the Expresso category are shown in the Kanban columns

#### Scenario: Filtering by Lanches
- **WHEN** admin clicks the "Lanches" tab
- **THEN** only orders belonging to the Lanches category are shown in the Kanban columns

### Requirement: Admin can sort orders in the queue
The system SHALL provide a sort dropdown in the board toolbar with options "Mais recentes", "Mais antigos", and "Prioridade".

#### Scenario: Default sort is most recent
- **WHEN** the page loads
- **THEN** orders within each column are sorted most-recent-first

#### Scenario: Changing sort order
- **WHEN** admin selects a different sort option from the dropdown
- **THEN** the cards within each Kanban column are re-ordered accordingly without a page reload

### Requirement: Admin can advance an order's status
The system SHALL allow the admin to advance an order through its lifecycle via action buttons on each card. RECEIVED cards show "Iniciar preparo"; IN_PREPARATION cards show "Concluir".

#### Scenario: Initiate preparation for a received order
- **WHEN** admin clicks "Iniciar preparo" on a RECEIVED order
- **THEN** the order status is updated to IN_PREPARATION and the card moves to the Em Preparo column

#### Scenario: Complete an in-preparation order
- **WHEN** admin clicks "Concluir" on an IN_PREPARATION order
- **THEN** the order status is updated to READY and the card is removed from the active Kanban board

#### Scenario: Action button is disabled while updating
- **WHEN** a status update request is in-flight for an order
- **THEN** that order's action button is disabled and shows a loading state

### Requirement: Admin can cancel an order
The system SHALL allow the admin to cancel an active order via a delete button on each card.

#### Scenario: Cancel a RECEIVED order
- **WHEN** admin clicks the delete button on a RECEIVED order
- **THEN** the order status is updated to CANCELLED and the card is removed from the queue

#### Scenario: Cancel an IN_PREPARATION order
- **WHEN** admin clicks the delete button on an IN_PREPARATION order
- **THEN** the order status is updated to CANCELLED and the card is removed from the queue

### Requirement: Admin can search orders by customer name
The system SHALL provide a search input in the page header that filters the Kanban board by customer name.

#### Scenario: Search narrows visible cards
- **WHEN** admin types a name into the search field
- **THEN** only order cards whose customer name contains the typed string (case-insensitive) are shown across all Kanban columns

#### Scenario: Clearing search restores full list
- **WHEN** admin clears the search field
- **THEN** all orders matching the current category filter are shown again

### Requirement: Footer displays queue statistics
The system SHALL display a statistics footer at the bottom of the page showing operational metrics.

#### Scenario: Order count is shown
- **WHEN** orders are loaded
- **THEN** the footer shows the count of orders currently in the active queue

#### Scenario: Team status is shown
- **WHEN** the page is displayed
- **THEN** the footer shows placeholder team member avatars (B1, B2, CZ) with the label "Operação ativa"
