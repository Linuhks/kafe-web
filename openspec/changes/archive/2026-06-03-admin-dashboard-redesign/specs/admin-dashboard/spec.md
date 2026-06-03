## MODIFIED Requirements

### Requirement: Dashboard in-page header
The system SHALL render a non-sticky `<header>` element inside the main content padding area of `/admin/dashboard`. The header SHALL contain:
- A headline "Overview" using `text-headline-lg` (or `text-4xl font-bold`) and today's formatted date in `text-body-md text-on-surface-variant`
- A notification bell icon with an error-dot badge (static decoration)
- The `<GenerateReportButton />` client component

The header SHALL NOT use `position: sticky`, `backdrop-filter`, `z-index` layering, or a top border that separates it from the page background.

#### Scenario: Header renders inline with page content
- **WHEN** an ADMIN user visits `/admin/dashboard`
- **THEN** the "Overview" heading and date are visible at the top of the scrollable content area with no sticky overlay behavior

#### Scenario: Header scrolls with page
- **WHEN** the user scrolls down on a dashboard with enough content
- **THEN** the header scrolls out of view along with the rest of the page content

### Requirement: Dashboard bento grid layout
The system SHALL render the analytics widgets (Best Selling Products and Peak Hours) in a two-column responsive grid using `lg:grid-cols-3` where Best Selling Products spans `col-span-2` and Peak Hours spans the remaining column (`col-span-1`).

#### Scenario: Bento grid renders at large breakpoint
- **WHEN** the viewport is ≥ 1024 px
- **THEN** Best Selling Products occupies approximately two-thirds of the row width and Peak Hours occupies one-third

#### Scenario: Bento grid stacks on small screens
- **WHEN** the viewport is < 1024 px
- **THEN** both panels stack vertically in a single column
