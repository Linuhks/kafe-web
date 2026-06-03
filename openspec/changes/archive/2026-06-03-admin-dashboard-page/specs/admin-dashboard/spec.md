## MODIFIED Requirements

### Requirement: Dashboard summary cards
The system SHALL display three summary cards in a 3-column grid: **Total Orders**, **Total Revenue**, and **Average Ticket** (formerly "Average Order Value"). Each card SHALL include: a category icon in a `secondary-container` tinted rounded container, a percentage-change badge (green `trending_up` icon for positive, red `trending_down` icon for negative), the metric label in uppercase `label-sm` type, and the metric value in `headline-lg` type. Values SHALL reflect the selected date range. Revenue and average SHALL be formatted as currency.

#### Scenario: Summary loads with default date range
- **WHEN** an admin visits `/admin/dashboard` without URL params
- **THEN** summary cards show today's totals fetched from the backend

#### Scenario: Summary updates on date range change
- **WHEN** the admin selects a custom date range via DateRangePicker
- **THEN** the page re-fetches and summary cards reflect the new range

#### Scenario: Positive trend badge renders
- **WHEN** a metric has a positive percentage change
- **THEN** its card shows a green badge with a `trending_up` icon and the percentage value

#### Scenario: Negative trend badge renders
- **WHEN** a metric has a negative percentage change
- **THEN** its card shows a red badge with a `trending_down` icon and the percentage value

### Requirement: Top products panel
The system SHALL display a "Best Selling Products" panel in a bento-grid layout spanning 7 of 12 columns on desktop. When product data is available it SHALL render a list of top-performing products. When no data is available it SHALL render an empty-state: a dashed-border container with a bar-chart icon, a "No sales data yet" heading, a descriptive message, and a "Sync Point of Sale" text link.

#### Scenario: Empty state renders when no data
- **WHEN** the dashboard loads and `topProducts` is empty
- **THEN** the "Best Selling Products" panel shows the empty state with the bar-chart icon, heading, message, and Sync link

#### Scenario: Panel renders products when data present
- **WHEN** the dashboard loads and `topProducts` is non-empty
- **THEN** the panel lists products ordered by quantity sold (descending) with revenue per product

### Requirement: Peak hours panel
The system SHALL display a "Peak Hours" panel in a bento-grid layout spanning 5 of 12 columns on desktop. When hourly data is available it SHALL render the native SVG bar chart. When no data is available it SHALL render an empty-state: a dashed-border container with a clock icon, an "Awaiting Hourly Traffic" heading, and a descriptive message.

#### Scenario: Empty state renders when no data
- **WHEN** the dashboard loads and `peakHours` data is empty
- **THEN** the "Peak Hours" panel shows the empty state with the clock icon, heading, and message

#### Scenario: SVG chart renders when data present
- **WHEN** the dashboard loads and `peakHours` contains data
- **THEN** the SVG chart is rendered inside the Peak Hours panel

### Requirement: Dashboard in-page header
The system SHALL render a sticky in-page header at the top of the dashboard main content area (below the global admin layout) containing: a page title "Overview" in `headline-lg` type, a formatted date line in `body-md`/`on-surface-variant`, a notification bell icon button with an error-dot badge, and a "Generate Report" primary button. Clicking "Generate Report" SHALL show a success toast message.

#### Scenario: Header renders on dashboard load
- **WHEN** an admin visits `/admin/dashboard`
- **THEN** the sticky header is visible with "Overview" title, current date, notification bell, and Generate Report button

#### Scenario: Generate Report shows toast
- **WHEN** an admin clicks the "Generate Report" button
- **THEN** a toast notification appears confirming the report generation started
