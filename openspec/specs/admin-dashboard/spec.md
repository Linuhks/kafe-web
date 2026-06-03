## Requirements

### Requirement: Admin layout with sidebar navigation
The system SHALL render a sidebar for all `/admin/*` routes containing:
- A **logo lockup** at the top: a filled coffee icon in a `kafe-primary` rounded square, followed by the wordmark "KAFE" in `kafe-primary` uppercase text.
- Navigation links: Dashboard, Products, Categories, Users, Inventory. Each link SHALL display an icon and a label. The active route SHALL be indicated by a `kafe-secondary-container` background tint and `kafe-primary` text/icon color.
- A **Settings** link at the bottom of the nav area.
- A **user profile card** pinned to the sidebar footer, separated from the nav by a top border. The card SHALL display the logged-in user's initials in a `kafe-primary` avatar circle, their full name, and their role label.

Access SHALL be restricted to ADMIN role (enforced by existing middleware).

#### Scenario: Admin navigates to dashboard
- **WHEN** an ADMIN user visits `/admin/dashboard`
- **THEN** the sidebar is visible with the Kafe logo at the top, "Dashboard" marked active, and the user profile card at the bottom

#### Scenario: Active link highlights correct route
- **WHEN** an ADMIN user visits `/admin/products`
- **THEN** the "Products" link shows the active highlight and all other links show the inactive style

#### Scenario: User profile card shows session data
- **WHEN** the sidebar mounts and the session fetch succeeds
- **THEN** the footer card displays the user's initials, full name, and role

#### Scenario: User profile card shows skeleton while loading
- **WHEN** the sidebar mounts and the session fetch is in flight
- **THEN** the footer area renders a loading skeleton instead of the profile card

#### Scenario: Non-admin access is blocked
- **WHEN** a non-ADMIN user (CLIENT or BARISTA) requests any `/admin/*` route
- **THEN** middleware redirects them away (existing behavior, not changed)

### Requirement: Dashboard summary cards
The system SHALL display three summary cards: Total Orders, Total Revenue, and Average Order Value. Values SHALL reflect the selected date range. Revenue and average SHALL be formatted as currency.

#### Scenario: Summary loads with default date range
- **WHEN** an admin visits `/admin/dashboard` without URL params
- **THEN** summary cards show today's totals fetched from the backend

#### Scenario: Summary updates on date range change
- **WHEN** the admin selects a custom date range via DateRangePicker
- **THEN** the page re-fetches and summary cards reflect the new range

### Requirement: Top products table
The system SHALL display a table of top-performing products with columns: Product Name, Quantity Sold, Revenue. Data SHALL be fetched for the selected date range.

#### Scenario: Table renders top products
- **WHEN** the dashboard loads
- **THEN** a table lists products ordered by quantity sold (descending) with revenue per product

### Requirement: Peak hours SVG chart
The system SHALL render a native SVG bar chart (no external chart library) showing order counts per hour of day (0–23) for the selected date range. The chart SHALL use a `viewBox` of `0 0 960 300`. Bar heights SHALL be linearly scaled to `orderCount`. Hour labels SHALL appear on the x-axis.

#### Scenario: Chart renders all 24 hours
- **WHEN** the dashboard loads
- **THEN** the SVG contains 24 bars, one per hour, with x-axis labels 0–23

#### Scenario: Chart scales correctly to max count
- **WHEN** the busiest hour has an `orderCount` of N
- **THEN** that bar reaches the maximum chart height and all other bars scale proportionally

### Requirement: Date range filter via URL params
The system SHALL provide a DateRangePicker Client Component with `from` and `to` date inputs (ISO format). Changing the range SHALL update the URL search params (`?from=YYYY-MM-DD&to=YYYY-MM-DD`) and trigger a server-side re-fetch of all three analytics datasets. The default range SHALL be today's date.

#### Scenario: DateRangePicker updates URL on change
- **WHEN** the admin selects a new date range
- **THEN** the URL updates with `from` and `to` params and the page data refreshes

#### Scenario: Direct URL with params loads correct data
- **WHEN** an admin opens `/admin/dashboard?from=2025-01-01&to=2025-01-31`
- **THEN** all three widgets display data for January 2025
