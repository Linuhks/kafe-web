## ADDED Requirements

### Requirement: Single proxy file convention
The project SHALL use only `proxy.ts` as the Next.js request interception file. No `middleware.ts` file SHALL exist in the project root.

#### Scenario: Dev server starts without conflict errors
- **WHEN** the Next.js dev server starts
- **THEN** no "Both middleware file and proxy file are detected" error is thrown

#### Scenario: Route protection is enforced via proxy.ts
- **WHEN** an unauthenticated user accesses a protected route
- **THEN** `proxy.ts` intercepts the request and redirects to `/login`
