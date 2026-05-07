## ADDED Requirements

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
