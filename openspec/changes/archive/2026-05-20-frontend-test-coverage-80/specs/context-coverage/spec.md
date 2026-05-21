## ADDED Requirements

### Requirement: CartContext is fully tested
The system SHALL have tests for `context/CartContext.tsx` covering all cart operations, derived values, and sessionStorage persistence.

#### Scenario: addItem adds a new product to the cart
- **WHEN** `addItem(product)` is called with a product not already in the cart
- **THEN** `items` SHALL contain one entry with `quantity: 1`

#### Scenario: addItem increments quantity for existing product
- **WHEN** `addItem(product)` is called twice with the same product
- **THEN** `items` SHALL contain one entry with `quantity: 2`

#### Scenario: removeItem removes a product from the cart
- **WHEN** `removeItem(productId)` is called for a product in the cart
- **THEN** `items` SHALL not contain that product

#### Scenario: updateQuantity changes the quantity of a product
- **WHEN** `updateQuantity(productId, 3)` is called
- **THEN** the product's quantity in `items` SHALL be 3

#### Scenario: updateQuantity with zero removes the item
- **WHEN** `updateQuantity(productId, 0)` is called
- **THEN** the product SHALL be removed from `items`

#### Scenario: clearCart empties all items
- **WHEN** `clearCart()` is called with multiple items in the cart
- **THEN** `items` SHALL be an empty array

#### Scenario: total reflects item prices and quantities
- **WHEN** the cart contains two items with prices 10.00 and 5.50 and quantities 2 and 1
- **THEN** `total` SHALL equal 25.50

#### Scenario: itemCount sums all quantities
- **WHEN** the cart contains items with quantities 2 and 3
- **THEN** `itemCount` SHALL equal 5

#### Scenario: Cart is restored from sessionStorage on mount
- **WHEN** `sessionStorage` contains previously saved cart data
- **THEN** on mount the cart SHALL be initialized with those items

#### Scenario: useCart throws outside provider
- **WHEN** `useCart()` is called outside a `CartProvider`
- **THEN** it SHALL throw an error

### Requirement: AuthContext is tested
The system SHALL have tests for `context/AuthContext.tsx` covering user state, setUser, and logout behavior.

#### Scenario: Initial user is null
- **WHEN** `AuthProvider` is rendered without a pre-set user
- **THEN** `useAuth().user` SHALL be `null`

#### Scenario: setUser updates the user state
- **WHEN** `setUser(mockUser)` is called
- **THEN** `useAuth().user` SHALL equal `mockUser`

#### Scenario: logout clears user state
- **WHEN** `logout()` is called
- **THEN** `useAuth().user` SHALL be `null` after the async call settles

#### Scenario: logout calls the logout API endpoint
- **WHEN** `logout()` is called
- **THEN** it SHALL POST to `/api/auth/logout`

### Requirement: ToastContext is tested
The system SHALL have tests for `context/ToastContext.tsx` verifying that `addToast` delegates to Sonner.

#### Scenario: addToast calls Sonner with correct type
- **WHEN** `addToast('Order ready', 'success')` is called
- **THEN** Sonner's `toast.success` SHALL be called with `'Order ready'`

#### Scenario: addToast error type maps to toast.error
- **WHEN** `addToast('Failed', 'error')` is called
- **THEN** Sonner's `toast.error` SHALL be called with `'Failed'`
