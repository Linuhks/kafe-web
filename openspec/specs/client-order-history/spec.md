### Requirement: Client can view paginated order history
Authenticated CLIENT users SHALL be able to access `/orders/me` and see a paginated list of their own orders. Each page SHALL display up to the backend's default page size of orders. The page SHALL accept a `?page=<number>` URL search param to control which page is shown.

#### Scenario: Client views first page of orders
- **WHEN** an authenticated CLIENT navigates to `/orders/me`
- **THEN** the page renders a list of the client's most recent orders
- **THEN** pagination controls are shown if `totalPages > 1`

#### Scenario: Client navigates to a specific page
- **WHEN** an authenticated CLIENT navigates to `/orders/me?page=2`
- **THEN** the page renders the second page of orders

#### Scenario: Client has no orders
- **WHEN** an authenticated CLIENT with no order history views `/orders/me`
- **THEN** the page displays an empty state message (e.g., "Nenhum pedido encontrado")
- **THEN** no pagination controls are shown

#### Scenario: Unauthenticated access is blocked
- **WHEN** an unauthenticated user navigates to `/orders/me`
- **THEN** middleware redirects them to `/login`

### Requirement: Each order card displays required fields
Each order in the list SHALL display: order ID (short-form or full UUID), client name, status badge (color-coded), list of ordered items with quantities, order creation timestamp, and total amount formatted as currency (BRL).

#### Scenario: Order card shows all required fields
- **WHEN** the order list renders a single order
- **THEN** the order ID is visible
- **THEN** the status badge is color-coded: RECEIVED=blue, IN_PREPARATION=amber, READY=green, DELIVERED=gray, CANCELLED=red
- **THEN** each item shows product name and quantity
- **THEN** `createdAt` is formatted as a human-readable date/time
- **THEN** `totalAmount` is formatted as BRL currency (e.g., "R$ 12,50")

### Requirement: Skeleton loaders shown during data fetch
While order data is loading, the page SHALL display skeleton placeholder elements matching the shape of order cards.

#### Scenario: Skeleton renders on initial load
- **WHEN** the page is fetching order data
- **THEN** skeleton placeholders are visible in place of order cards

### Requirement: NavBar shows "My Orders" link for CLIENT role
Authenticated CLIENT users SHALL see a "My Orders" navigation link in the NavBar. Users with BARISTA or ADMIN roles SHALL NOT see this link.

#### Scenario: CLIENT user sees My Orders link
- **WHEN** an authenticated CLIENT views any page
- **THEN** the NavBar contains a "Meus Pedidos" link pointing to `/orders/me`

#### Scenario: Non-CLIENT user does not see My Orders link
- **WHEN** an authenticated BARISTA or ADMIN views any page
- **THEN** the NavBar does NOT contain a link to `/orders/me`
