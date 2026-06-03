## MODIFIED Requirements

### Requirement: Order summary sidebar
The right column SHALL render a sticky sidebar (`sticky top-32`) with `bg-kafe-surface-container-lowest border-kafe-outline-variant rounded-xl` showing: heading "Order Summary", scrollable item list, price breakdown (Subtotal, Shipping, Tax, Total), promo code input + Apply button, and a trust badges footer (Secure, Free Ship, Warranty).

Each item in the scrollable list SHALL render a `w-24 h-24` thumbnail using a native `<img>` element with `object-cover`. When `imageUrl` is absent or the image fails to load, the thumbnail SHALL fall back to `/images/product-placeholder.svg` via an `onError` handler.

#### Scenario: Sidebar is sticky on scroll
- **WHEN** user scrolls down the checkout form
- **THEN** the order summary sidebar remains visible, anchored to the top

#### Scenario: Price breakdown rendered
- **WHEN** order summary renders
- **THEN** Subtotal, Shipping (Free), Estimated Tax, and Total rows are visible

#### Scenario: Trust badges rendered
- **WHEN** order summary renders
- **THEN** lock/Secure, local_shipping/Free Ship, verified/Warranty badges are visible in the sidebar footer

#### Scenario: Item thumbnail renders product image
- **WHEN** an order summary item has an `imageUrl`
- **THEN** the thumbnail displays the product photo via a native `<img>` element

#### Scenario: Item thumbnail falls back to placeholder
- **WHEN** an order summary item has no `imageUrl` or the image URL fails to load
- **THEN** the thumbnail displays `/images/product-placeholder.svg`
