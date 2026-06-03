## 1. NavBar

- [x] 1.1 Remove `h-14` fixed height from the header; add `px-8 py-6` padding to the inner flex container
- [x] 1.2 Change logo from `text-lg` to `text-2xl`
- [x] 1.3 Replace `variant="outline" size="sm"` on the cart `<Button>` with ghost/text style using `text-[var(--kafe-primary)] hover:opacity-80` and `flex items-center gap-2`

## 2. ProductCard

- [x] 2.1 Replace `bg-card border` on `<article>` with `bg-surface-container-lowest border border-outline-variant`
- [x] 2.2 Replace `bg-muted` on the image container `<div>` with `bg-secondary-container/20`
- [x] 2.3 Change inner body padding from `p-4` to `p-6`
- [x] 2.4 Change product name class from `font-medium leading-tight` to `text-xl font-bold text-on-surface`
- [x] 2.5 Remove `line-clamp-2` from the description; add `leading-relaxed mb-6` spacing

## 3. CartSidebar

- [x] 3.1 Change sidebar width from `max-w-sm` to `max-w-md`
- [x] 3.2 Change sidebar background from `bg-background` to `bg-surface-container-lowest`
- [x] 3.3 Increase header padding from `px-4 py-3` to `p-8`; update border to `border-outline-variant`
- [x] 3.4 Increase scrollable items area padding from `p-4` to `p-8`
- [x] 3.5 Update footer: padding `p-8`, background `bg-surface-container-low`, border `border-outline-variant`
- [x] 3.6 Style total amount as `text-2xl font-extrabold text-[var(--kafe-primary)]`

## 4. Page Footer

- [x] 4.1 Add a `<footer>` element to `app/cardapio/page.tsx` below `<main>` with `bg-surface-container-highest border-t border-outline-variant`
- [x] 4.2 Add footer inner layout: `max-w-7xl mx-auto px-8 py-12` flex container with "Kafe" wordmark + copyright on the left and three navigation links on the right

## 5. Tests

- [x] 5.1 Update `ProductCard.test.tsx` snapshots / class assertions for new token and padding values
- [x] 5.2 Update `CartSidebar.test.tsx` snapshots / class assertions for new width, padding, and total styling
- [x] 5.3 Run `pnpm test` and confirm all tests pass
