## ADDED Requirements

### Requirement: Checkout page route exists
The system SHALL expose a `/checkout` route rendered by `app/checkout/page.tsx` as a Client Component (`'use client'`).

#### Scenario: Route renders
- **WHEN** user navigates to `/checkout`
- **THEN** the page renders without errors, showing the checkout header and both columns

### Requirement: Numbered form sections
The checkout form SHALL contain three numbered sections in order: **01 Contact Information**, **02 Shipping Address**, **03 Payment Method**. Each section heading SHALL display its number in `text-kafe-primary` and title in `text-headline-md`.

#### Scenario: All sections present
- **WHEN** the checkout page is rendered
- **THEN** sections labeled "01 Contact Information", "02 Shipping Address", and "03 Payment Method" are visible in that order

### Requirement: Contact section fields
The contact section SHALL contain a single email input with label "Email Address" and placeholder `ritual@kafe.com`.

#### Scenario: Email input rendered
- **WHEN** the contact section renders
- **THEN** an email input with the correct label and placeholder is present

### Requirement: Shipping section fields
The shipping section SHALL contain: First Name, Last Name (side by side on md+), Street Address (full width), City, and Postal Code inputs.

#### Scenario: All shipping fields rendered
- **WHEN** the shipping section renders
- **THEN** five inputs are present: First Name, Last Name, Street Address, City, Postal Code

#### Scenario: Two-column layout on medium screens
- **WHEN** viewport is medium (768px+)
- **THEN** First Name and Last Name appear side by side, Street Address spans full width

### Requirement: Payment section fields
The payment section SHALL contain: Card Number (with trailing `credit_card` icon), Expiry Date, and CVC inputs, wrapped in a `bg-kafe-surface-container-low` card with `border-kafe-outline-variant` border.

#### Scenario: Payment fields rendered
- **WHEN** the payment section renders
- **THEN** card number, expiry, and CVC inputs are visible inside a bordered card

### Requirement: Input underline style
All checkout form inputs SHALL use the underline style: `bg-transparent`, bottom border only (`border-b border-kafe-outline-variant`), `focus:border-kafe-primary`, no outline ring.

#### Scenario: Input focus border changes to primary
- **WHEN** user focuses any form input
- **THEN** the bottom border color transitions to `kafe-primary`

### Requirement: Confirm Purchase CTA
A full-width "Confirm Purchase" button SHALL appear below the payment section using `bg-kafe-primary text-kafe-on-primary`, with a `chevron_right` Material Symbol icon that translates right on hover.

#### Scenario: Button renders and icon animates
- **WHEN** the confirm button renders and user hovers it
- **THEN** the chevron icon translates right via `group-hover:translate-x-1`

### Requirement: Order summary sidebar
The right column SHALL render a sticky sidebar (`sticky top-32`) with `bg-kafe-surface-container-lowest border-kafe-outline-variant rounded-xl` showing: heading "Order Summary", scrollable item list, price breakdown (Subtotal, Shipping, Tax, Total), promo code input + Apply button, and a trust badges footer (Secure, Free Ship, Warranty).

#### Scenario: Sidebar is sticky on scroll
- **WHEN** user scrolls down the checkout form
- **THEN** the order summary sidebar remains visible, anchored to the top

#### Scenario: Price breakdown rendered
- **WHEN** order summary renders
- **THEN** Subtotal, Shipping (Free), Estimated Tax, and Total rows are visible

#### Scenario: Trust badges rendered
- **WHEN** order summary renders
- **THEN** lock/Secure, local_shipping/Free Ship, verified/Warranty badges are visible in the sidebar footer

### Requirement: Two-column responsive layout
On large screens (lg+) the layout SHALL be a 12-column CSS grid with the form spanning 7 columns and the sidebar spanning 5 columns. On smaller screens both columns stack vertically.

#### Scenario: Two-column on large viewport
- **WHEN** viewport is large (1024px+)
- **THEN** form and sidebar appear side by side

#### Scenario: Single column on small viewport
- **WHEN** viewport is small (< 1024px)
- **THEN** form and sidebar stack vertically
