## ADDED Requirements

### Requirement: ProductCard component is tested
The system SHALL have tests for `components/catalog/ProductCard.tsx` covering rendering, cart interaction, and unavailable state.

#### Scenario: Renders product name and price
- **WHEN** `ProductCard` is rendered with a product
- **THEN** the product's name and formatted BRL price SHALL be visible in the DOM

#### Scenario: Add to cart button calls addItem
- **WHEN** the user clicks the "Adicionar" button
- **THEN** `addItem` SHALL be called with the product and a success toast SHALL fire

#### Scenario: Button is disabled for unavailable products
- **WHEN** the product has `isAvailable: false`
- **THEN** the button SHALL be disabled and show "Indisponível"

#### Scenario: Image falls back to placeholder on error
- **WHEN** the image `onError` fires
- **THEN** the `src` SHALL change to the placeholder SVG path

### Requirement: CategoryTabs component is tested
The system SHALL have tests for `components/catalog/CategoryTabs.tsx` covering tab rendering and active-tab selection.

#### Scenario: Renders a tab for each category plus "Todos"
- **WHEN** `CategoryTabs` is rendered with two categories
- **THEN** three tab buttons SHALL be visible: "Todos", and one per category

#### Scenario: Clicking a tab calls onSelect with correct id
- **WHEN** the user clicks a category tab
- **THEN** `onSelect` SHALL be called with that category's id

#### Scenario: Active tab is visually distinguished
- **WHEN** a category is selected
- **THEN** that tab SHALL have the active style applied

### Requirement: StatusButton component is tested
The system SHALL have tests for `components/barista/StatusButton.tsx` covering label display and click handling.

#### Scenario: Renders the current order status label
- **WHEN** `StatusButton` is rendered with `status: 'IN_PREPARATION'`
- **THEN** the visible label SHALL match the Portuguese display name for that status

#### Scenario: onClick fires with the next status
- **WHEN** the button is clicked
- **THEN** `onStatusChange` SHALL be called with the correct next-state value

### Requirement: ConfirmModal component is tested
The system SHALL have tests for `components/admin/ConfirmModal.tsx` covering open/close behavior and confirm/cancel actions.

#### Scenario: Modal is not visible when closed
- **WHEN** `ConfirmModal` is rendered with `open: false`
- **THEN** the modal content SHALL not be present in the DOM

#### Scenario: Modal displays message when open
- **WHEN** `open: true` and `message` prop is set
- **THEN** the message text SHALL be visible

#### Scenario: Confirm button calls onConfirm
- **WHEN** the user clicks the confirm button
- **THEN** `onConfirm` SHALL be called once

#### Scenario: Cancel button calls onClose
- **WHEN** the user clicks the cancel button
- **THEN** `onClose` SHALL be called once

### Requirement: UI primitives are smoke-tested
The system SHALL have at least one rendering test for each primitive in `components/ui/` (`button`, `input`, `badge`, `skeleton`, `pagination`) confirming they render without errors.

#### Scenario: Button renders with label
- **WHEN** `<Button>Click me</Button>` is rendered
- **THEN** a button element with text "Click me" SHALL be in the DOM

#### Scenario: Input renders and accepts value
- **WHEN** `<Input value="test" onChange={() => {}} />` is rendered
- **THEN** an input element with value "test" SHALL be present

#### Scenario: Badge renders with variant
- **WHEN** `<Badge variant="destructive">Error</Badge>` is rendered
- **THEN** the badge element SHALL be in the DOM with text "Error"

#### Scenario: Skeleton renders placeholder
- **WHEN** `<Skeleton className="h-4 w-full" />` is rendered
- **THEN** a DOM element with the skeleton class SHALL be present

#### Scenario: Pagination renders page controls
- **WHEN** `<Pagination>` is rendered with page and total props
- **THEN** navigation controls SHALL be visible in the DOM
