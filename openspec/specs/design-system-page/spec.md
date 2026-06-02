## Requirements

### Requirement: Page renders sticky navigation header
The page SHALL render a sticky top navigation bar with the Kafe brand wordmark, a set of nav links, and cart/profile icon buttons.

#### Scenario: Header is present with brand name
- **WHEN** the design system page is rendered
- **THEN** a `<header>` element with `sticky` positioning contains the text "Kafe" as the brand wordmark

#### Scenario: Navigation links are present
- **WHEN** the design system page is rendered
- **THEN** "Design System", "Shop", "Roastery", and "Our Story" navigation links are visible

### Requirement: Page renders typography and color palette section
The page SHALL render a section displaying all six Kafe type scale specimens and four color swatches.

#### Scenario: Type scale specimens present
- **WHEN** the design system page is rendered
- **THEN** the typography section contains specimens for Display Hero ("Ritual"), Headline Large, Body Large, Body Medium, and Label Small

#### Scenario: Color swatches present
- **WHEN** the design system page is rendered
- **THEN** four color swatches are shown: Primary, Accent, Surface, and Neutral

### Requirement: Page renders interactive elements table
The page SHALL render a table showing Primary, Outline, and Destructive button variants across Normal, Hover, and Disabled states.

#### Scenario: Button table header is present
- **WHEN** the design system page is rendered
- **THEN** the Interactive Elements section contains a table with column headers: Variant, Normal, Hover, Disabled

#### Scenario: Three button variant rows are present
- **WHEN** the design system page is rendered
- **THEN** the table contains rows labelled PRIMARY, OUTLINE, and DESTRUCTIVE

### Requirement: Page renders order states section
The page SHALL render a section showing all four order state badge variants: Recebido, Em preparo, Concluído, Cancelado.

#### Scenario: All order states shown
- **WHEN** the design system page is rendered
- **THEN** the Order States section shows badges for Recebido, Em preparo, Concluído, and Cancelado

#### Scenario: Em preparo badge has animated pulse indicator
- **WHEN** the design system page is rendered
- **THEN** the "Em preparo" badge contains a dot element with the `animate-pulse` class

### Requirement: Page renders form inputs section
The page SHALL render a Form Inputs section containing an email text input (underline style) and a textarea (box style).

#### Scenario: Email input present
- **WHEN** the design system page is rendered
- **THEN** a form input with label "Email Address" and placeholder "ritual@kafe.com" is visible

#### Scenario: Textarea present
- **WHEN** the design system page is rendered
- **THEN** a textarea with label "Order Observations" is visible

### Requirement: Page renders navigation shell previews
The page SHALL render a Navigation Shells section showing a top-bar mockup and a sidebar mockup side by side.

#### Scenario: Top bar mockup visible
- **WHEN** the design system page is rendered
- **THEN** the Navigation Shells section contains a top-bar preview with the "KAFE" wordmark

#### Scenario: Sidebar mockup visible
- **WHEN** the design system page is rendered
- **THEN** the Navigation Shells section contains a sidebar preview with "Your Selection" heading and nav items: Coffee Beans, Brewing Gear, Subscription

### Requirement: Page renders composite card examples
The page SHALL render a Composite Cards section with three card templates: Order card, Product card, and Subscription/Membership card.

#### Scenario: Order card present
- **WHEN** the design system page is rendered
- **THEN** a card with "Order #8842" label and "Marcos V." customer name is visible

#### Scenario: Product card present
- **WHEN** the design system page is rendered
- **THEN** a card with the "Guatemalan Antigua" product name and "Add to Selection" button is visible

#### Scenario: Subscription card present
- **WHEN** the design system page is rendered
- **THEN** a card with "MEMBERSHIP" badge, "The Ritualist" heading, and "Subscribe Now" button is visible

### Requirement: Page renders footer
The page SHALL render a footer with the Kafe brand name and copyright text alongside legal navigation links.

#### Scenario: Footer copyright present
- **WHEN** the design system page is rendered
- **THEN** the footer contains "© 2024 Kafe Roastery. All rights reserved." and links for Privacy Policy, Terms of Service, Contact, and Wholesale

### Requirement: Material Symbols icons render on the page
The page SHALL load the Material Symbols Outlined icon font and use it for icons in the header, section headings, sidebar, and card elements.

#### Scenario: Icon font stylesheet loaded
- **WHEN** the application layout renders
- **THEN** a `<link>` to the Material Symbols Outlined Google Font stylesheet is present in the document head
