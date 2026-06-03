## ADDED Requirements

### Requirement: Admin can view the product list
The system SHALL display all products in a sortable, paginated table at `/admin/products`. Each row SHALL show: a product thumbnail (falling back to a placeholder icon if `imageUrl` is absent), product name and subtitle in `text-kafe-primary`, category as a colour-coded pill badge, price right-aligned in `text-[18px]`, availability as a toggle switch (active state uses `bg-kafe-primary`), and icon-only action buttons (edit, delete). The table SHALL be wrapped in a `bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl` container. A search input and category filter chips SHALL appear above the table and filter rows client-side.

#### Scenario: Product list renders server-side
- **WHEN** an admin navigates to `/admin/products`
- **THEN** the page renders with a product table pre-populated with products fetched on the server

#### Scenario: Admin sorts by column
- **WHEN** the admin clicks a sortable column header
- **THEN** the table re-orders rows by that column (ascending, then descending on second click)

#### Scenario: Admin paginates the list
- **WHEN** there are more products than the page size
- **THEN** pagination controls appear and navigating pages updates the visible rows and the URL `?page=N` param

### Requirement: Admin can toggle product availability inline
The system SHALL allow toggling a product's `isAvailable` field directly from the product list row without navigating to the edit page.

#### Scenario: Toggle availability on
- **WHEN** the admin clicks the availability toggle on a row where `isAvailable` is `false`
- **THEN** the system calls the toggle API, updates the row optimistically, and shows a success toast

#### Scenario: Toggle availability off
- **WHEN** the admin clicks the availability toggle on a row where `isAvailable` is `true`
- **THEN** the system calls the toggle API, updates the row optimistically, and shows a success toast

#### Scenario: Toggle fails
- **WHEN** the API returns an error
- **THEN** the toggle reverts and an error toast is shown

### Requirement: Admin can create a product
The system SHALL provide a create-product form at `/admin/products/new` with fields: name, description, price, imageUrl, categoryId (select), and isAvailable (checkbox).

#### Scenario: Successful product creation
- **WHEN** the admin fills all required fields and submits
- **THEN** the system POSTs to the products API, shows a success toast, and redirects to `/admin/products`

#### Scenario: Validation error on submit
- **WHEN** the admin submits with missing required fields
- **THEN** inline validation errors appear and no API call is made

#### Scenario: API error on create
- **WHEN** the API returns an error on submit
- **THEN** an error toast is shown and the form remains open with values preserved

### Requirement: Admin can edit a product
The system SHALL provide a pre-filled edit form at `/admin/products/[id]/edit` with the same fields as the create form.

#### Scenario: Form pre-fills with existing data
- **WHEN** the admin navigates to `/admin/products/[id]/edit`
- **THEN** all form fields are pre-populated with the current product data

#### Scenario: Successful product update
- **WHEN** the admin modifies fields and submits
- **THEN** the system PUTs/PATCHes the product, shows a success toast, and redirects to `/admin/products`

#### Scenario: API error on edit
- **WHEN** the API returns an error on submit
- **THEN** an error toast is shown and the form remains open with values preserved

### Requirement: Admin can delete a product
The system SHALL require a confirmation step before deleting a product, presented via a modal dialog.

#### Scenario: Delete confirmation flow
- **WHEN** the admin clicks the Delete button on a product row
- **THEN** a ConfirmModal appears showing the product name and warning text

#### Scenario: Admin confirms deletion
- **WHEN** the admin clicks Confirm in the ConfirmModal
- **THEN** the system calls the delete API, closes the modal, shows a success toast, and removes the row from the DataTable

#### Scenario: Admin cancels deletion
- **WHEN** the admin clicks Cancel in the ConfirmModal
- **THEN** the modal closes and no API call is made

### Requirement: Admin can manage product ingredients
The edit page SHALL include an ingredient management section that lists current ingredients (with quantity) and allows adding or removing them.

#### Scenario: Existing ingredients are listed
- **WHEN** the admin opens the edit page for a product with linked ingredients
- **THEN** each ingredient is shown with its name and quantity

#### Scenario: Admin adds an ingredient
- **WHEN** the admin selects an ingredient from the dropdown and enters a quantity, then clicks Add
- **THEN** the system calls the add-ingredient API and the ingredient appears in the list

#### Scenario: Admin removes an ingredient
- **WHEN** the admin clicks the remove button next to an ingredient
- **THEN** the system calls the remove-ingredient API and the ingredient disappears from the list

#### Scenario: Adding duplicate ingredient
- **WHEN** the admin tries to add an ingredient already in the list
- **THEN** an error message is shown and no API call is made

### Requirement: Admin is warned before leaving a dirty form
The system SHALL warn the admin if they attempt to navigate away from a create or edit form that has unsaved changes.

#### Scenario: Browser navigation with unsaved changes
- **WHEN** the admin has modified form fields and attempts to close the tab or navigate away via browser controls
- **THEN** the browser's native beforeunload dialog appears prompting confirmation

#### Scenario: In-app navigation with unsaved changes
- **WHEN** the admin clicks a link or button that would navigate away from the form with unsaved changes
- **THEN** a confirmation prompt appears before navigation proceeds

#### Scenario: No warning when form is clean
- **WHEN** the admin has not modified any form fields
- **THEN** navigation proceeds without any warning dialog

### Requirement: Product API module exposes write operations
`lib/api/products.ts` SHALL export `createProduct(data)`, `updateProduct(id, data)`, `deleteProduct(id)`, and `toggleProductAvailability(id)` as named async functions wrapping the corresponding Orval-generated functions.

#### Scenario: Create product wrapper is callable
- **WHEN** server-side code calls `createProduct(data)`
- **THEN** it wraps `productsControllerCreate` from the generated API and returns the created product or throws on error

#### Scenario: Update product wrapper is callable
- **WHEN** server-side code calls `updateProduct(id, data)`
- **THEN** it wraps `productsControllerUpdate` and returns the updated product or throws on error

#### Scenario: Delete product wrapper is callable
- **WHEN** server-side code calls `deleteProduct(id)`
- **THEN** it wraps `productsControllerRemove` and returns on success or throws on error

#### Scenario: Toggle availability wrapper is callable
- **WHEN** server-side code calls `toggleProductAvailability(id)`
- **THEN** it wraps `productsControllerToggleAvail` and returns on success or throws on error

### Requirement: Product ingredient API operations are exposed in the products module
`lib/api/products.ts` SHALL export `getProductIngredients(productId)`, `addProductIngredient(productId, data)`, and `removeProductIngredient(productId, ingredientId)` as named async functions.

#### Scenario: Get product ingredients is callable
- **WHEN** server-side code calls `getProductIngredients(productId)`
- **THEN** it returns the list of ingredients linked to the product

#### Scenario: Add ingredient wrapper is callable
- **WHEN** server-side code calls `addProductIngredient(productId, data)`
- **THEN** it links the ingredient to the product and returns the result or throws on error

#### Scenario: Remove ingredient wrapper is callable
- **WHEN** server-side code calls `removeProductIngredient(productId, ingredientId)`
- **THEN** it unlinks the ingredient from the product or throws on error
