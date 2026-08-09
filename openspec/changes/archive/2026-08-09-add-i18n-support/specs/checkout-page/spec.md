## MODIFIED Requirements

### Requirement: Numbered form sections
The checkout form SHALL contain three numbered sections in order: **01 Informações de Contato**, **02 Endereço de Entrega**, **03 Forma de Pagamento**. Each section heading SHALL display its number in `text-kafe-primary` and title in `text-headline-md`.

#### Scenario: All sections present
- **WHEN** the checkout page is rendered
- **THEN** sections labeled "01 Informações de Contato", "02 Endereço de Entrega", and "03 Forma de Pagamento" are visible in that order

### Requirement: Contact section fields
The contact section SHALL contain a single email input with label "Endereço de E-mail" and placeholder `ritual@kafe.com`.

#### Scenario: Email input rendered
- **WHEN** the contact section renders
- **THEN** an email input with the correct label and placeholder is present

### Requirement: Shipping section fields
The shipping section SHALL contain: Nome, Sobrenome (side by side on md+), Endereço (full width), Cidade, and CEP inputs.

#### Scenario: All shipping fields rendered
- **WHEN** the shipping section renders
- **THEN** five inputs are present: Nome, Sobrenome, Endereço, Cidade, CEP

#### Scenario: Two-column layout on medium screens
- **WHEN** viewport is medium (768px+)
- **THEN** Nome and Sobrenome appear side by side, Endereço spans full width

### Requirement: Payment section fields
The payment section SHALL contain: Número do Cartão (with trailing `credit_card` icon), Validade, and CVC inputs, wrapped in a `bg-kafe-surface-container-low` card with `border-kafe-outline-variant` border.

#### Scenario: Payment fields rendered
- **WHEN** the payment section renders
- **THEN** card number, expiry, and CVC inputs are visible inside a bordered card, labeled "Número do Cartão", "Validade", "CVC"

### Requirement: Confirm Purchase CTA
A full-width "Confirmar Compra" button SHALL appear below the payment section using `bg-kafe-primary text-kafe-on-primary`, with a `chevron_right` Material Symbol icon that translates right on hover.

#### Scenario: Button renders and icon animates
- **WHEN** the confirm button renders and user hovers it
- **THEN** the chevron icon translates right via `group-hover:translate-x-1`

### Requirement: Order summary sidebar
The right column SHALL render a sticky sidebar (`sticky top-32`) with `bg-kafe-surface-container-lowest border-kafe-outline-variant rounded-xl` showing: heading "Resumo do Pedido", scrollable item list, price breakdown (Subtotal, Frete, Impostos, Total) formatted in `pt-BR`/BRL (`R$`), a promo code input + "Aplicar" button, and a trust badges footer (Seguro, Frete Grátis, Garantia).

Each item in the scrollable list SHALL render a `w-24 h-24` thumbnail using a native `<img>` element with `object-cover`. When `imageUrl` is absent or the image fails to load, the thumbnail SHALL fall back to `/images/product-placeholder.svg` via an `onError` handler.

#### Scenario: Sidebar is sticky on scroll
- **WHEN** user scrolls down the checkout form
- **THEN** the order summary sidebar remains visible, anchored to the top

#### Scenario: Price breakdown rendered
- **WHEN** order summary renders
- **THEN** Subtotal, Frete (Grátis), Impostos estimados, and Total rows are visible, with all monetary values formatted as `R$` (BRL), not `$` (USD)

#### Scenario: Trust badges rendered
- **WHEN** order summary renders
- **THEN** lock/Seguro, local_shipping/Frete Grátis, verified/Garantia badges are visible in the sidebar footer

#### Scenario: Item thumbnail renders product image
- **WHEN** an order summary item has an `imageUrl`
- **THEN** the thumbnail displays the product photo via a native `<img>` element

#### Scenario: Item thumbnail falls back to placeholder
- **WHEN** an order summary item has no `imageUrl` or the image URL fails to load
- **THEN** the thumbnail displays `/images/product-placeholder.svg`
