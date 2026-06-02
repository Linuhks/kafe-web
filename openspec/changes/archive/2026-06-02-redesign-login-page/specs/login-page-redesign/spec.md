## ADDED Requirements

### Requirement: Split-panel layout
The login page SHALL render a two-column layout on desktop (md breakpoint and above): a visual narrative panel on the left (3/5 width) and a form panel on the right. On mobile, only the form panel is shown.

#### Scenario: Desktop layout
- **WHEN** viewport is at or above the `md` breakpoint
- **THEN** left visual panel is visible and occupies at least 40% of the viewport width

#### Scenario: Mobile layout
- **WHEN** viewport is below the `md` breakpoint
- **THEN** left visual panel is hidden and a KAFE wordmark is shown above the form

### Requirement: Hero image with parallax effect
The left panel SHALL display a full-bleed background image. On desktop, the image SHALL move subtly in response to cursor position (parallax), tracking mouse X/Y by up to 15px offset.

#### Scenario: Parallax responds to mouse
- **WHEN** user moves their mouse on a desktop viewport
- **THEN** the hero image translates within ±15px in X and Y, scaled to 1.1

#### Scenario: No parallax on touch devices
- **WHEN** the page loads on a mobile viewport with no mouse events
- **THEN** the image remains static with no transform applied

### Requirement: Brand typography and color tokens
The login page SHALL use Plus Jakarta Sans for all text and the Kafe Material-You color palette (warm browns, surface variants) as defined in the Tailwind token set. The color tokens SHALL be scoped under the `kafe-` prefix to avoid collision with shadcn/radix tokens.

#### Scenario: Font applied
- **WHEN** the login page renders
- **THEN** all text uses Plus Jakarta Sans

#### Scenario: Brand colors applied
- **WHEN** the login page renders
- **THEN** the primary background uses `kafe-background` (#fcf9f8) and primary action color uses `kafe-primary` (#553722)

### Requirement: Password visibility toggle
The password field SHALL include a toggle button that switches the input type between `password` and `text`. The button icon SHALL reflect the current state (visibility / visibility_off).

#### Scenario: Show password
- **WHEN** user clicks the visibility toggle while input type is `password`
- **THEN** input type changes to `text` and icon changes to `visibility_off`

#### Scenario: Hide password
- **WHEN** user clicks the visibility toggle while input type is `text`
- **THEN** input type changes back to `password` and icon changes to `visibility`

### Requirement: Social login button placeholders
The login page SHALL display Google and Apple sign-in buttons. These buttons SHALL be rendered but SHALL NOT trigger any authentication flow in this iteration.

#### Scenario: Buttons visible
- **WHEN** the login page renders
- **THEN** both Google and Apple buttons are visible below the form

#### Scenario: No-op on click
- **WHEN** user clicks either social button
- **THEN** no navigation or network request occurs

### Requirement: Existing form logic preserved
All existing login form behavior (React Hook Form validation, Zod schema, API call, role-based redirect, error toasts) SHALL remain unchanged after the visual redesign.

#### Scenario: Successful login still redirects
- **WHEN** user submits valid credentials
- **THEN** the system authenticates via the existing API, sets the session cookie, and redirects to the role-appropriate dashboard

#### Scenario: Validation errors still show
- **WHEN** user submits with an invalid email or short password
- **THEN** inline validation messages appear below the relevant fields
