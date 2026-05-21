## Requirements

### Requirement: ProductCard is covered by unit tests
`components/catalog/ProductCard.tsx` SHALL have unit tests wrapping the component with `CartProvider` and `ToastProvider`, covering product name and price rendering, addItem on click, disabled state for unavailable products, and image fallback behaviour.

#### Scenario: Product name and price rendered
- **WHEN** `<ProductCard product={product} />` is rendered
- **THEN** the product name and formatted price are visible in the document

#### Scenario: Add to cart triggers addItem
- **WHEN** the user clicks the "Add to cart" button
- **THEN** `addItem` is called with the product

#### Scenario: Unavailable product is disabled
- **WHEN** `product.available` is `false`
- **THEN** the "Add to cart" button is disabled and cannot be clicked

#### Scenario: Image fallback on error
- **WHEN** the product image fails to load
- **THEN** a fallback placeholder image or element is rendered

### Requirement: CategoryTabs is covered by unit tests
`components/catalog/CategoryTabs.tsx` SHALL have unit tests covering tab count (categories plus the "All" tab), the onSelect callback, and active-tab styling.

#### Scenario: All tab plus category tabs rendered
- **WHEN** `<CategoryTabs categories={[c1, c2]} />` is rendered
- **THEN** three tabs are visible: "All" (or equivalent), c1.name, and c2.name

#### Scenario: onSelect called with selected category
- **WHEN** the user clicks a category tab
- **THEN** the `onSelect` callback is called with that category's identifier

#### Scenario: Active tab is visually distinguished
- **WHEN** a tab is the currently selected one
- **THEN** it carries the active styling class or aria-selected attribute

### Requirement: StatusButton is covered by unit tests
`components/barista/StatusButton.tsx` SHALL have unit tests covering status label display and the onStatusChange callback with the next-state value.

#### Scenario: Current status label rendered
- **WHEN** `<StatusButton status="pending" />` is rendered
- **THEN** the label reflecting "pending" is visible

#### Scenario: onStatusChange called with next state
- **WHEN** the button is clicked
- **THEN** `onStatusChange` is called with the next logical status value

### Requirement: ConfirmModal is covered by unit tests
`components/admin/ConfirmModal.tsx` SHALL have unit tests covering hidden state when closed, message display when open, and both onConfirm and onClose callbacks.

#### Scenario: Modal not visible when closed
- **WHEN** `<ConfirmModal open={false} message="Delete?" />` is rendered
- **THEN** the message text is not visible in the document

#### Scenario: Modal visible when open
- **WHEN** `<ConfirmModal open={true} message="Delete?" />` is rendered
- **THEN** the text "Delete?" is visible in the document

#### Scenario: onConfirm callback invoked
- **WHEN** the confirm button inside the modal is clicked
- **THEN** the `onConfirm` callback is called once

#### Scenario: onClose callback invoked
- **WHEN** the cancel or close button inside the modal is clicked
- **THEN** the `onClose` callback is called once

### Requirement: UI primitive components are covered by smoke tests
`components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/badge.tsx`, `components/ui/skeleton.tsx`, and `components/ui/pagination.tsx` SHALL each have at least one render smoke test confirming the component mounts without error.

#### Scenario: Button renders
- **WHEN** `<Button>Click me</Button>` is rendered
- **THEN** the element is present in the document without errors

#### Scenario: Input renders
- **WHEN** `<Input placeholder="Type here" />` is rendered
- **THEN** the input element is present in the document

#### Scenario: Badge renders
- **WHEN** `<Badge>New</Badge>` is rendered
- **THEN** the badge element is present in the document

#### Scenario: Skeleton renders
- **WHEN** `<Skeleton />` is rendered
- **THEN** the skeleton placeholder element is present in the document

#### Scenario: Pagination renders
- **WHEN** `<Pagination page={1} totalPages={5} onPageChange={() => {}} />` is rendered
- **THEN** the pagination controls are present in the document
