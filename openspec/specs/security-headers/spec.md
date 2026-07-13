### Requirement: Strict-Transport-Security header is present on all responses
The Next.js application SHALL set a `Strict-Transport-Security` response header on every route with the value `max-age=63072000; includeSubDomains; preload` (2 years).

#### Scenario: HSTS header present on page response
- **WHEN** a browser requests any page (e.g. `/login`, `/admin/dashboard`)
- **THEN** the response includes `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

#### Scenario: HSTS header present on API route response
- **WHEN** a browser calls `/api/auth/session`
- **THEN** the response includes the `Strict-Transport-Security` header

#### Scenario: HSTS header present on static asset response served by Next.js
- **WHEN** a browser requests a route matched by the `source: '/(.*)'` header rule
- **THEN** the `Strict-Transport-Security` header is included
