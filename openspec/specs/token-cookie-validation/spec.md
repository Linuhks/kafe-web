### Requirement: /api/auth/login validates JWT structure before setting cookie
The route SHALL verify that the `token` field in the request body matches the structural pattern of a JWT (three base64url-encoded segments separated by `.`) before writing the `kafe_token` cookie. Token signature is NOT verified server-side — that remains the backend's responsibility on each authenticated request.

#### Scenario: Well-formed JWT is accepted
- **WHEN** the request body contains `{ "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.abc" }`
- **THEN** the route sets the `kafe_token` cookie and returns `{ success: true }` with status 200

#### Scenario: Plain string without dot-segments is rejected
- **WHEN** the request body contains `{ "token": "notajwt" }`
- **THEN** the route returns `{ message: 'Invalid token format' }` with status 400 and does NOT set a cookie

#### Scenario: Two-segment value is rejected
- **WHEN** the request body contains `{ "token": "header.payload" }` (missing signature segment)
- **THEN** the route returns `{ message: 'Invalid token format' }` with status 400 and does NOT set a cookie

#### Scenario: Empty string is rejected
- **WHEN** the request body contains `{ "token": "" }`
- **THEN** the route returns `{ message: 'token is required' }` with status 400
