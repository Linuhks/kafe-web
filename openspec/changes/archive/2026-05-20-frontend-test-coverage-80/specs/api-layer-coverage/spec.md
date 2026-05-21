## ADDED Requirements

### Requirement: apiFetch builds correct URLs
The system SHALL have tests for `lib/api/fetcher.ts::apiFetch` that verify URL construction, param serialization, and response parsing by mocking the global `fetch`.

#### Scenario: Appends query params to URL
- **WHEN** `apiFetch('/api/v1/products', { method: 'GET', params: { page: '1' } })` is called
- **THEN** the underlying `fetch` SHALL be called with URL ending in `/api/v1/products?page=1`

#### Scenario: Sets Content-Type for requests with body
- **WHEN** `apiFetch('/api/v1/products', { method: 'POST', body: JSON.stringify({}) })` is called
- **THEN** `fetch` SHALL be called with `Content-Type: application/json` header

#### Scenario: Returns parsed JSON with status and headers
- **WHEN** `fetch` resolves with `status: 200` and JSON body `{ id: '1' }`
- **THEN** `apiFetch` SHALL resolve with `{ data: { id: '1' }, status: 200, headers: <Headers> }`

#### Scenario: Returns empty data for 204 response
- **WHEN** `fetch` resolves with `status: 204` and no body
- **THEN** `apiFetch` SHALL resolve with `{ data: {}, status: 204, headers: <Headers> }`

#### Scenario: Uses full URL server-side
- **WHEN** called in a server-side context (`window === undefined`) and `NEXT_PUBLIC_API_URL` is set to `http://api:3333`
- **THEN** `fetch` SHALL be called with `http://api:3333/api/v1/products`

#### Scenario: Throws in production without NEXT_PUBLIC_API_URL
- **WHEN** `NODE_ENV` is `production` and `NEXT_PUBLIC_API_URL` is undefined
- **THEN** calling `apiFetch` SHALL throw an error containing `NEXT_PUBLIC_API_URL is required`

### Requirement: server-fetch is tested
The system SHALL have tests for `lib/api/server-fetch.ts` verifying that it forwards session cookies and handles auth headers.

#### Scenario: Includes session cookie in request
- **WHEN** `serverFetch` is called with an active session cookie
- **THEN** the forwarded request SHALL include the `Cookie` header with the session value

#### Scenario: Returns typed response data
- **WHEN** the upstream API returns valid JSON
- **THEN** `serverFetch` SHALL return parsed data with correct TypeScript shape
