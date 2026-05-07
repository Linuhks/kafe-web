## MODIFIED Requirements

### Requirement: Single proxy file convention
The project SHALL use only `proxy.ts` as the Next.js request interception file. No `middleware.ts` file SHALL exist in the project root. The `proxy.ts` file SHALL verify user sessions by calling the better-auth session endpoint on the backend, not by decoding or verifying tokens locally.

#### Scenario: Dev server starts without conflict errors
- **WHEN** the Next.js dev server starts
- **THEN** no "Both middleware file and proxy file are detected" error is thrown

#### Scenario: Route protection is enforced via proxy.ts
- **WHEN** an unauthenticated user accesses a protected route
- **THEN** `proxy.ts` intercepts the request and redirects to `/login`

#### Scenario: Session verification uses backend endpoint
- **WHEN** `proxy.ts` needs to determine the role of an authenticated user
- **THEN** it calls `GET <API_URL>/api/auth/get-session` with the token as Bearer, not local JWT decode
