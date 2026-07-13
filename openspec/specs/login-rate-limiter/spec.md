### Requirement: Rate limiter rejects requests with no identifiable IP
When no trusted IP can be extracted from the request, the `/api/auth/login` route SHALL return `429 Too Many Requests` immediately rather than falling back to a shared bucket keyed on `'unknown'`.

#### Scenario: Request arrives without x-forwarded-for
- **WHEN** a POST to `/api/auth/login` arrives with no `x-forwarded-for` header and no configured trusted-proxy override header
- **THEN** the route returns `{ message: 'Too many requests' }` with status 429

#### Scenario: Request arrives with x-forwarded-for set
- **WHEN** a POST to `/api/auth/login` arrives with `x-forwarded-for: 203.0.113.1`
- **THEN** the route proceeds to process the login (rate limit evaluated against `203.0.113.1`)

### Requirement: Rate limiter IP is read from a configurable trusted-proxy header
The route SHALL read the client IP from the header named by the `TRUSTED_PROXY_HEADER` environment variable (default: `x-forwarded-for`). Only the first value in a comma-separated list SHALL be used.

#### Scenario: Default header (x-forwarded-for) is used when env var is absent
- **WHEN** `TRUSTED_PROXY_HEADER` is not set
- **THEN** the rate limiter reads the IP from the `x-forwarded-for` header

#### Scenario: Custom header overrides x-forwarded-for when env var is set
- **WHEN** `TRUSTED_PROXY_HEADER=cf-connecting-ip` is set and the request has `cf-connecting-ip: 203.0.113.5`
- **THEN** the rate limiter keys on `203.0.113.5`

#### Scenario: Only the first IP in a comma-separated list is used
- **WHEN** the trusted-proxy header contains `203.0.113.1, 10.0.0.1, 172.16.0.1`
- **THEN** the rate limiter keys on `203.0.113.1`

### Requirement: Expired rate-limit entries are pruned on access
When `isRateLimited` finds an expired entry for an IP, it SHALL delete the entry rather than simply resetting it, preventing unbounded growth of the in-memory `Map`.

#### Scenario: Expired entry is deleted on next access
- **WHEN** a rate-limit entry for an IP has passed its `resetAt` time and a new request arrives from that IP
- **THEN** the old entry is removed from the Map and a fresh entry is created with `count: 1`

### Requirement: Rate limiter is documented as per-instance with known restart-reset behaviour
The in-memory rate limiter SHALL include an inline comment noting that counters are per-process, reset on restart, and not shared across instances.

#### Scenario: Comment is present in source
- **WHEN** a developer reads `app/api/auth/login/route.ts`
- **THEN** a comment above the `attempts` Map explains the per-instance limitation
