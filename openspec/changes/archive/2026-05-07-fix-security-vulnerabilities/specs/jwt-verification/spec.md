## ADDED Requirements

### Requirement: Middleware verifies JWT signature before trusting role claim
The middleware SHALL cryptographically verify the HMAC-SHA256 signature of the `kafe_token` cookie using the `JWT_SECRET` environment variable before extracting the role claim. If verification fails for any reason (invalid signature, malformed token, missing secret), the middleware SHALL treat the request as unauthenticated.

#### Scenario: Valid token with correct signature grants access
- **WHEN** a request arrives with a `kafe_token` cookie containing a correctly signed JWT with `role: "ADMIN"`
- **THEN** the middleware extracts the role and allows access to `/admin/*` routes

#### Scenario: Token with forged signature is rejected
- **WHEN** a request arrives with a `kafe_token` cookie where the signature does not match the payload
- **THEN** the middleware treats the request as unauthenticated and redirects to `/login`

#### Scenario: Token with valid structure but wrong secret is rejected
- **WHEN** a request arrives with a JWT signed by a different secret
- **THEN** the middleware treats the request as unauthenticated and redirects to `/login`

#### Scenario: Missing JWT_SECRET causes fail-closed behavior
- **WHEN** the `JWT_SECRET` environment variable is not set
- **THEN** the middleware rejects all tokens and redirects to `/login`

### Requirement: Session cookie has a bounded lifetime
The `/api/auth/login` route handler SHALL set `maxAge: 28800` (8 hours) on the `kafe_token` cookie so that sessions expire automatically.

#### Scenario: Cookie expires after 8 hours
- **WHEN** the `kafe_token` cookie is set during login
- **THEN** the cookie includes `Max-Age=28800` in the Set-Cookie header

### Requirement: Form inputs enforce maximum length
Order form and user management forms SHALL reject inputs exceeding defined maximum lengths before submission.

#### Scenario: Order clientName exceeds 100 characters
- **WHEN** a user types more than 100 characters into the clientName field
- **THEN** the form displays a validation error and prevents submission

#### Scenario: Order notes exceeds 500 characters
- **WHEN** a user types more than 500 characters into the notes field
- **THEN** the form displays a validation error and prevents submission

### Requirement: Login errors do not expose internal details
The login page SHALL display only a generic error message when authentication fails. Raw error objects or backend response bodies SHALL NOT be shown to the user.

#### Scenario: Network or backend error during login
- **WHEN** the login request throws an exception
- **THEN** the toast shows "Login failed. Please try again." with no additional technical detail

### Requirement: Image domains are explicitly allowlisted
The Next.js image configuration SHALL not use wildcard (`**`) hostname patterns. Only explicitly named hostnames SHALL be permitted.

#### Scenario: Image from non-allowlisted host is blocked
- **WHEN** a product image URL points to a hostname not in the allowlist
- **THEN** Next.js refuses to optimize or serve the image
