## Why

After completing checkout, users land on a blank state with no feedback about their order. An order confirmation page closes the purchase loop — it reassures the user, shows what was ordered, and gives them next steps (pickup location, receipt download).

## What Changes

- Add a new `/checkout/confirmation` route (or `/orders/[orderId]/confirmation`) that renders after successful payment
- Display a success hero with animated check icon and "Thank you for your order" headline
- Show an order status card with estimated ready time, order ID, and a 3-step progress bar (Received → Roasting → Ready)
- Display an order summary card listing each item with its image, name, variant, and price — plus subtotal, tax, and total
- Show a pickup location card with a map image and "Get Directions" CTA
- Show a support callout card
- Footer actions: "Return to Shop" link and "Download Receipt" button

## Capabilities

### New Capabilities
- `order-confirmation-page`: Full confirmation screen rendered after a successful order; includes success hero, order status tracker, itemised order summary, pickup location card, and footer actions.

### Modified Capabilities

## Impact

- New page route under `app/` (server component, reads order ID from URL/cookie)
- Reuses `TopNavBar` and `Footer` shared layout components
- Needs access to order data (items, totals, status, pickup info) — likely via a GET `/orders/:id` API call
- Product item images fetched from the same image pipeline used in checkout
