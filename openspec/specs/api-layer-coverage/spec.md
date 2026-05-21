## Requirements

### Requirement: lib/api/fetcher.ts is covered by unit tests
`lib/api/fetcher.ts` SHALL have unit tests using `vi.stubGlobal` to mock global `fetch`, covering URL construction, query parameter serialisation, Content-Type header, 200 JSON response, 204 empty response, and production environment guard.

#### Scenario: URL constructed with base path
- **WHEN** `fetcher('/products')` is called
- **THEN** `fetch` is invoked with a URL that includes the configured base path and `/products`

#### Scenario: Query parameters appended to URL
- **WHEN** `fetcher('/products', { params: { page: 1, limit: 10 } })` is called
- **THEN** the URL passed to `fetch` includes `?page=1&limit=10`

#### Scenario: Content-Type header set for POST
- **WHEN** `fetcher('/orders', { method: 'POST', body: { item: 1 } })` is called
- **THEN** `fetch` is invoked with `Content-Type: application/json`

#### Scenario: 200 response returns parsed JSON
- **WHEN** `fetch` resolves with status 200 and a JSON body
- **THEN** `fetcher` resolves with the parsed object

#### Scenario: 204 response returns undefined or null
- **WHEN** `fetch` resolves with status 204 (No Content)
- **THEN** `fetcher` resolves without attempting to parse the body

#### Scenario: Non-2xx response throws
- **WHEN** `fetch` resolves with status 400 or 500
- **THEN** `fetcher` rejects with an error containing the status code

### Requirement: lib/api/server-fetch.ts is covered by unit tests
`lib/api/server-fetch.ts` SHALL have unit tests with `next/headers` cookies mocked, covering session cookie forwarding and response shape.

#### Scenario: Session cookie forwarded to upstream
- **WHEN** a server request is made and a session cookie exists in `next/headers`
- **THEN** the upstream fetch includes the cookie in the `Cookie` header

#### Scenario: Response shape matches expected contract
- **WHEN** the upstream returns a valid JSON response
- **THEN** `server-fetch` returns the same data without transformation

### Requirement: Domain API modules are covered by unit tests
The domain modules `lib/api/categories.ts`, `lib/api/products.ts`, `lib/api/orders.ts`, `lib/api/inventory.ts`, `lib/api/users.ts`, and `lib/api/dashboard.ts` SHALL each have unit tests confirming the correct endpoint is called with the expected arguments.

#### Scenario: Category list endpoint
- **WHEN** the categories `list` function is called
- **THEN** `fetcher` (or `server-fetch`) is invoked with the categories endpoint

#### Scenario: Product CRUD endpoints
- **WHEN** product create, read, update, and delete functions are called
- **THEN** each invokes `fetcher` with the correct HTTP method and product endpoint

#### Scenario: Order submission
- **WHEN** the order create function is called with an order payload
- **THEN** `fetcher` is called with `POST` and the orders endpoint

#### Scenario: Inventory and dashboard read endpoints
- **WHEN** inventory and dashboard fetch functions are called
- **THEN** `fetcher` is invoked with the respective endpoints
