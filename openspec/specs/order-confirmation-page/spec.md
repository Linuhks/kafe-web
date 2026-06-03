## ADDED Requirements

### Requirement: Order confirmation route exists
The system SHALL expose a `/checkout/confirmation` route rendered by `app/checkout/confirmation/page.tsx` as a Server Component (no `'use client'`). It SHALL accept an `orderId` search param and use it to fetch order details server-side.

#### Scenario: Route renders with valid orderId
- **WHEN** user navigates to `/checkout/confirmation?orderId=KF-88291`
- **THEN** the page renders without errors, showing the success hero and both layout columns

#### Scenario: Route degrades gracefully without orderId
- **WHEN** user navigates to `/checkout/confirmation` with no `orderId` param
- **THEN** the page renders a minimal success state ("Thank you for your order") without item details

### Requirement: Success hero section
The page SHALL display a centered hero section containing: an animated check icon inside a `bg-kafe-secondary-container` circle with a floating CSS animation, an `h1` "Thank you for your order" in `text-headline-lg text-primary`, and a supporting paragraph in `text-body-lg text-kafe-on-surface-variant`.

#### Scenario: Hero icon renders with float animation
- **WHEN** the confirmation page renders
- **THEN** a filled `check_circle` Material Symbol icon is visible inside a circular `bg-kafe-secondary-container` container with a CSS float animation

#### Scenario: Hero headline and body copy render
- **WHEN** the confirmation page renders
- **THEN** the text "Thank you for your order" is visible as an h1, and the supporting copy about preparation and email receipt is visible below it

### Requirement: Order status card
A status card SHALL display the estimated ready time (`text-headline-md text-primary`), the order ID (`#KF-XXXXX`), and a horizontal 3-step progress bar (Received → Roasting → Ready). The active step SHALL be highlighted in `bg-kafe-primary`; inactive step labels SHALL use `text-kafe-on-surface-variant`.

#### Scenario: Status card renders with order data
- **WHEN** the confirmation page receives order data
- **THEN** the estimated ready time, order ID, and progress bar with three labeled steps are visible

#### Scenario: First step is active by default
- **WHEN** order status is "Received"
- **THEN** the "Received" label renders in `text-kafe-primary` and the progress bar fill covers approximately one-third of its width

### Requirement: Order summary card
An order summary card SHALL list each ordered item with: a `w-16 h-16` thumbnail image (`object-cover`, fallback to `/images/product-placeholder.svg` on error), item name in `font-bold text-on-surface`, item variant in `text-label-sm text-kafe-on-surface-variant`, and price in `font-bold text-primary`. Below the item list, it SHALL show a price breakdown: Subtotal, Tax, and Total rows. The Total row SHALL use `text-headline-md`.

#### Scenario: Items render with product images
- **WHEN** order items have image URLs
- **THEN** each item shows its thumbnail, name, variant description, and price

#### Scenario: Item thumbnail falls back to placeholder
- **WHEN** an order item has no image URL or the image fails to load
- **THEN** the thumbnail displays `/images/product-placeholder.svg`

#### Scenario: Price breakdown renders
- **WHEN** the order summary card renders
- **THEN** Subtotal, Tax, and Total rows are visible with correct amounts; Total uses headline-md sizing

### Requirement: Pickup location card
A pickup location card SHALL display: a static map image at the top of the card, a "Pickup Location" heading in `text-headline-md text-primary`, the store name in `font-bold text-on-surface`, the store address in `text-kafe-on-surface-variant`, and a full-width "Get Directions" CTA button in `bg-kafe-primary text-kafe-on-primary rounded-lg` with a `chevron_right` icon.

#### Scenario: Location card renders
- **WHEN** the confirmation page renders
- **THEN** the map image, store name, address, and "Get Directions" button are visible

### Requirement: Support callout card
A support card SHALL render below the pickup location card with a `help_outline` Material Symbol icon, a bold heading "Need help with your ritual?", and supporting text with a phone/chat contact prompt. It SHALL use `bg-secondary-container/10 border border-secondary-container`.

#### Scenario: Support card renders
- **WHEN** the confirmation page renders
- **THEN** the support card is visible with the help icon, heading, and contact copy

### Requirement: Footer actions
Below the main content grid, the page SHALL render: a "Return to Shop" link (with `arrow_back` icon) in `text-on-surface-variant hover:text-primary`, and a "Download Receipt" button styled as `bg-kafe-surface-container-high text-kafe-primary rounded-full uppercase tracking-widest`.

#### Scenario: Footer actions render
- **WHEN** the confirmation page renders
- **THEN** both "Return to Shop" and "Download Receipt" actions are visible below the main grid

### Requirement: Two-column responsive layout
On medium screens and above, the page content SHALL use a 12-column grid: the left column (order status + order summary) spans 7 columns, the right column (pickup location + support card) spans 5 columns. On smaller screens both columns stack vertically.

#### Scenario: Two-column layout on medium+ viewport
- **WHEN** viewport is md or wider
- **THEN** status/summary cards and location/support cards appear side by side

#### Scenario: Stacked layout on small viewport
- **WHEN** viewport is below md breakpoint
- **THEN** all cards stack vertically in a single column

### Requirement: Shared layout integration
The confirmation page SHALL render inside the same layout as the rest of the app, using `TopNavBar` (with only the logo and icon buttons — no nav links, for a task-focused confirmation state) and `Footer`.

#### Scenario: TopNavBar renders on confirmation page
- **WHEN** the confirmation page renders
- **THEN** the Kafe logotype and cart/person icons are visible at the top

#### Scenario: Footer renders on confirmation page
- **WHEN** the confirmation page renders
- **THEN** the standard site footer with links and copyright is visible at the bottom
