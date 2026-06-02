## 1. Shared Layout Components

- [x] 1.1 Create `components/layout/TopNavBar.tsx` — sticky nav with Kafe logotype, hidden-mobile links (Shop, Roastery, Our Story, Locations), and person/shopping_cart icon buttons using `kafe-*` tokens
- [x] 1.2 Create `components/layout/Footer.tsx` — `bg-kafe-surface-container-high` footer with logotype, policy links, and copyright; responsive row on md+

## 2. Checkout Page

- [x] 2.1 Create `app/checkout/page.tsx` with `'use client'` directive and the full two-column 12-col grid structure
- [x] 2.2 Implement section 01 — Contact Information with email input using underline style (`border-b border-kafe-outline-variant focus:border-kafe-primary`)
- [x] 2.3 Implement section 02 — Shipping Address with 5 fields in 2-col md grid (First Name, Last Name, Street Address full-width, City, Postal Code)
- [x] 2.4 Implement section 03 — Payment Method with card number + `credit_card` icon, expiry + CVC side by side, wrapped in `bg-kafe-surface-container-low` bordered card
- [x] 2.5 Add "Confirm Purchase" full-width CTA button with `chevron_right` icon and `group-hover:translate-x-1` animation
- [x] 2.6 Implement sticky order summary sidebar — item list, price breakdown (Subtotal / Shipping Free / Tax / Total), promo code input + Apply button, trust badges footer

## 3. Compose Layout on Checkout Page

- [x] 3.1 Import and render `TopNavBar` at the top of `app/checkout/page.tsx`
- [x] 3.2 Import and render `Footer` at the bottom of `app/checkout/page.tsx`
- [x] 3.3 Verify the page renders correctly at `/checkout` and all `kafe-*` tokens apply as expected
