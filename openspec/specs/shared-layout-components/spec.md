## ADDED Requirements

### Requirement: TopNavBar component exists
A `TopNavBar` component SHALL be created at `components/layout/TopNavBar.tsx` as a Server Component (no `'use client'`). It SHALL accept no required props for initial implementation (nav links are static).

#### Scenario: Component file exists and renders
- **WHEN** TopNavBar is imported and rendered
- **THEN** it renders a `<nav>` element without errors

### Requirement: TopNavBar structure and styling
TopNavBar SHALL render: a sticky top bar (`sticky top-0 z-50`) with `bg-kafe-surface border-b border-kafe-outline-variant`, containing: Kafe logotype in `text-kafe-primary uppercase tracking-widest text-label-sm`, horizontal nav links (Shop, Roastery, Our Story, Locations) hidden on mobile (`hidden md:flex`), and right-side icon buttons (person, shopping_cart) in `text-kafe-on-surface-variant hover:text-kafe-primary`.

#### Scenario: Logotype rendered
- **WHEN** TopNavBar renders
- **THEN** "Kafe" text is visible with primary color and uppercase tracking

#### Scenario: Nav links hidden on mobile
- **WHEN** viewport is below md breakpoint
- **THEN** the nav links section is not visible

#### Scenario: Nav links visible on desktop
- **WHEN** viewport is md or wider
- **THEN** Shop, Roastery, Our Story, and Locations links are visible

#### Scenario: Icon buttons rendered
- **WHEN** TopNavBar renders
- **THEN** person and shopping_cart Material Symbol icons are visible on the right side

### Requirement: Footer component exists
A `Footer` component SHALL be created at `components/layout/Footer.tsx` as a Server Component (no `'use client'`).

#### Scenario: Component file exists and renders
- **WHEN** Footer is imported and rendered
- **THEN** it renders a `<footer>` element without errors

### Requirement: Footer structure and styling
Footer SHALL render: `bg-kafe-surface-container-high border-t border-kafe-outline-variant`, containing: Kafe logotype (`text-kafe-primary text-headline-md`), horizontal links (Privacy Policy, Terms of Service, Contact, Wholesale) in `text-kafe-on-surface-variant hover:text-kafe-primary text-label-sm`, and copyright text `© 2024 Kafe Roastery. All rights reserved.` in `text-kafe-on-surface-variant`. On mobile the layout stacks vertically; on md+ it is a row with `justify-between`.

#### Scenario: Footer links rendered
- **WHEN** Footer renders
- **THEN** Privacy Policy, Terms of Service, Contact, and Wholesale links are visible

#### Scenario: Copyright text rendered
- **WHEN** Footer renders
- **THEN** the copyright notice is visible

#### Scenario: Responsive layout
- **WHEN** viewport is md or wider
- **THEN** logotype, links, and copyright appear in a single row with space between
