## MODIFIED Requirements

### Requirement: Page renders sticky navigation header
The page SHALL render a sticky top navigation bar with the Kafe brand wordmark, a set of nav links, and cart/profile icon buttons.

#### Scenario: Header is present with brand name
- **WHEN** the design system page is rendered
- **THEN** a `<header>` element with `sticky` positioning contains the text "Kafe" as the brand wordmark

#### Scenario: Navigation links are present
- **WHEN** the design system page is rendered
- **THEN** "Design System", "Loja", "Torrefação", and "Nossa História" navigation links are visible

### Requirement: Page renders form inputs section
The page SHALL render a Form Inputs section containing an email text input (underline style) and a textarea (box style).

#### Scenario: Email input present
- **WHEN** the design system page is rendered
- **THEN** a form input with label "Endereço de E-mail" and placeholder "ritual@kafe.com" is visible

#### Scenario: Textarea present
- **WHEN** the design system page is rendered
- **THEN** a textarea with label "Observações do Pedido" is visible

### Requirement: Page renders navigation shell previews
The page SHALL render a Navigation Shells section showing a top-bar mockup and a sidebar mockup side by side. The sidebar mockup's heading SHALL read "Sua Seleção" and its example nav items SHALL be "Cafés", "Doces", "Salgados" — matching the real category names used elsewhere in the app.

#### Scenario: Top bar mockup visible
- **WHEN** the design system page is rendered
- **THEN** the Navigation Shells section contains a top-bar preview with the "KAFE" wordmark

#### Scenario: Sidebar mockup visible
- **WHEN** the design system page is rendered
- **THEN** the Navigation Shells section contains a sidebar preview with "Sua Seleção" heading and nav items: Cafés, Doces, Salgados

### Requirement: Page renders composite card examples
The page SHALL render a Composite Cards section with three card templates: Order card, Product card, and Subscription/Membership card. The Product card's CTA SHALL read "Adicionar à Seleção" (Add to Selection) and the Subscription card's badge and CTA SHALL read "ASSINATURA" (MEMBERSHIP) and "Assinar Agora" (Subscribe Now).

#### Scenario: Order card present
- **WHEN** the design system page is rendered
- **THEN** a card with "Order #8842" label and "Marcos V." customer name is visible

#### Scenario: Product card present
- **WHEN** the design system page is rendered
- **THEN** a card with the "Guatemalan Antigua" product name and "Adicionar à Seleção" button is visible

#### Scenario: Subscription card present
- **WHEN** the design system page is rendered
- **THEN** a card with "ASSINATURA" badge, "The Ritualist" heading, and "Assinar Agora" button is visible

### Requirement: Page renders footer
The page SHALL render a footer with the Kafe brand name and copyright text alongside legal navigation links.

#### Scenario: Footer copyright present
- **WHEN** the design system page is rendered
- **THEN** the footer contains "© 2024 Kafe Roastery. Todos os direitos reservados." and links for Política de Privacidade, Termos de Serviço, Contato, and Atacado
