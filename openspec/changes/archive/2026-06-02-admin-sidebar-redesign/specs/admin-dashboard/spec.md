## MODIFIED Requirements

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
