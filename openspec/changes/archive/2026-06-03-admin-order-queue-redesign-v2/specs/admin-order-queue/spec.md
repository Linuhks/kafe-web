## MODIFIED Requirements

### Requirement: Admin can view the order queue
The system SHALL provide a page at `/admin/orders` displaying all active orders in a three-column Kanban board with Kafe design system styling. Columns are **Recebidos**, **Em Preparo**, and **Concluídos**, each showing a count badge. The Concluídos column displays a static archived empty-state; it does not show individual completed order cards. Column indicator dots SHALL use design-system tokens: `secondary-container` for Recebidos, `primary-fixed` with a pulse animation for Em Preparo, and `tertiary-fixed` for Concluídos.

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

#### Scenario: Order card header has bottom border
- **WHEN** an order card is rendered
- **THEN** the header row (order number, customer name, status badge) is separated from the item list by a bottom border divider

### Requirement: Admin can advance an order's status
The system SHALL allow the admin to advance an order through its lifecycle via action buttons on each card. RECEIVED cards show "Iniciar preparo"; IN_PREPARATION cards show "Concluir". Both buttons SHALL use the filled `bg-primary` style.

#### Scenario: Initiate preparation for a received order
- **WHEN** admin clicks "Iniciar preparo" on a RECEIVED order
- **THEN** the order status is updated to IN_PREPARATION and the card moves to the Em Preparo column

#### Scenario: Complete an in-preparation order
- **WHEN** admin clicks "Concluir" on an IN_PREPARATION order
- **THEN** the order status is updated to READY and the card is removed from the active Kanban board

#### Scenario: Action button is disabled while updating
- **WHEN** a status update request is in-flight for an order
- **THEN** that order's action button is disabled and shows a loading state

#### Scenario: RECEIVED card action button is filled
- **WHEN** a RECEIVED order card is rendered
- **THEN** the "Iniciar preparo" button uses the filled `bg-primary` style (not an outlined style)

### Requirement: Order card status badges use design-system tokens
The system SHALL render status badges on order cards using the following design-system colour tokens: RECEIVED orders use `bg-secondary-container / text-on-secondary-container`; IN_PREPARATION orders use `bg-primary-fixed / text-on-primary-fixed-variant` with a small dot pulse indicator.

#### Scenario: RECEBIDO badge colour
- **WHEN** an order with RECEIVED status is displayed
- **THEN** the status badge uses `secondary-container` background and `on-secondary-container` text tokens

#### Scenario: EM PREPARO badge colour and indicator
- **WHEN** an order with IN_PREPARATION status is displayed
- **THEN** the status badge uses `primary-fixed` background, `on-primary-fixed-variant` text, and includes a dot pulse indicator

### Requirement: Footer displays queue statistics
The system SHALL display a statistics footer at the bottom of the page showing operational metrics including Tempo Médio de Preparo, Pedidos na Fila, and Eficiência. Team member avatars SHALL use `primary`, `secondary`, and `tertiary` token colours respectively.

#### Scenario: Order count is shown
- **WHEN** orders are loaded
- **THEN** the footer shows the count of orders currently in the active queue

#### Scenario: Eficiência stat is shown
- **WHEN** the page is displayed
- **THEN** the footer shows an "Eficiência" metric (placeholder value acceptable)

#### Scenario: Team status is shown with token colours
- **WHEN** the page is displayed
- **THEN** the footer shows team member avatars (B1, B2, CZ) using `primary`, `secondary`, and `tertiary` background tokens respectively, with the label "Operação ativa"
