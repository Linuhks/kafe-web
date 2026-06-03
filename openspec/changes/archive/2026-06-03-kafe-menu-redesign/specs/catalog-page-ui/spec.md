## MODIFIED Requirements

### Requirement: ProductCard displays tall image with price badge overlay
The system SHALL render each product in a card with `bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden` styling. The image container SHALL use `h-64 bg-secondary-container/20`. The product price SHALL be shown as a badge positioned `absolute top-4 right-4` with `bg-[var(--kafe-background)]/90 px-3 py-1 rounded-full` styling. The card body SHALL use `p-6` padding. The product name SHALL be styled `text-xl font-bold text-on-surface`. The description SHALL use `text-on-surface-variant text-sm leading-relaxed` (no line-clamp). The "Adicionar" button SHALL span the full card width (`w-full`) at the bottom, styled `bg-[var(--kafe-primary)] text-[var(--kafe-on-primary)] py-3 rounded-lg font-bold text-sm` with a `ChevronRight` icon.

#### Scenario: Price badge overlays the product image
- **WHEN** a product card is rendered
- **THEN** the formatted price appears as an overlay badge in the top-right corner of the image

#### Scenario: Add button spans the full card width
- **WHEN** a product card is rendered
- **THEN** the "Adicionar" button occupies the full width at the bottom of the card body with `p-6` inner padding

#### Scenario: Unavailable product shows disabled state
- **WHEN** a product with `isAvailable: false` is rendered
- **THEN** the "Adicionar" button is disabled and shows "Indisponível"

#### Scenario: Card uses design-system surface token
- **WHEN** a product card is rendered
- **THEN** the card background is `bg-surface-container-lowest` and the image placeholder background is `bg-secondary-container/20`

### Requirement: CartSidebar renders with correct width, padding, and total styling
The system SHALL render the cart sidebar with `max-w-md` width and `bg-surface-container-lowest` background. The sidebar header SHALL use `p-8` padding. The scrollable item area SHALL use `p-8` padding. The footer SHALL use `p-8 bg-surface-container-low border-t border-outline-variant`. The total amount SHALL be styled `text-2xl font-extrabold text-[var(--kafe-primary)]`.

#### Scenario: Cart sidebar is wide enough
- **WHEN** the cart sidebar is open
- **THEN** it renders with `max-w-md` (448 px) width

#### Scenario: Cart sidebar header has correct padding
- **WHEN** the cart sidebar is open
- **THEN** the header section uses `p-8` padding on all sides

#### Scenario: Total is prominently styled
- **WHEN** the cart sidebar is open
- **THEN** the total amount is rendered as `text-2xl font-extrabold` in `var(--kafe-primary)` colour

### Requirement: NavBar renders with full padding and ghost cart button
The system SHALL render the navbar header with `px-8 py-6` padding (no fixed `h-14`). The KAFE logo SHALL be `text-2xl font-extrabold tracking-widest uppercase text-[var(--kafe-primary)]`. The cart button SHALL use a ghost/text style (no border outline), `text-[var(--kafe-primary)] hover:opacity-80`, containing the cart icon and "Carrinho" label (uppercase, tracking-wider, hidden below `sm`).

#### Scenario: Navbar shows correct logo size
- **WHEN** the NavBar component is rendered
- **THEN** the "KAFE" text is `text-2xl font-extrabold`

#### Scenario: Cart button has no outline border
- **WHEN** the NavBar is rendered
- **THEN** the cart button does not have an outline border variant — it is styled as ghost/text with `text-[var(--kafe-primary)]`

#### Scenario: Navbar uses py-6 vertical padding
- **WHEN** the NavBar component is rendered
- **THEN** the header container has `py-6` vertical padding

## ADDED Requirements

### Requirement: CardapioPage includes a site footer
The system SHALL render a `<footer>` at the bottom of the `/cardapio` page containing: the "Kafe" wordmark (`text-xl font-extrabold text-[var(--kafe-primary)]`), a copyright line "© 2024 Kafe Roastery. Todos os direitos reservados." (`text-sm text-on-surface-variant`), and navigation links for "Política de Privacidade", "Termos de Serviço", and "Contato". The footer SHALL use `bg-surface-container-highest border-t border-outline-variant` and `px-8 py-12 max-w-7xl mx-auto`.

#### Scenario: Footer is visible at the bottom of the catalog page
- **WHEN** a user navigates to `/cardapio`
- **THEN** a footer containing the "Kafe" wordmark and copyright text is rendered at the bottom of the page

#### Scenario: Footer contains navigation links
- **WHEN** a user navigates to `/cardapio`
- **THEN** the footer displays links for "Política de Privacidade", "Termos de Serviço", and "Contato"
