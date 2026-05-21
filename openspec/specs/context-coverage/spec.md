## Requirements

### Requirement: CartContext is covered by unit tests
`context/CartContext.tsx` SHALL have unit tests rendering `CartProvider` with a test consumer, covering addItem, removeItem, updateQuantity (including zero-quantity removal), clearCart, total computation, itemCount, sessionStorage persistence, and the error thrown by `useCart` outside a provider.

#### Scenario: addItem adds a product to the cart
- **WHEN** `addItem(product, 2)` is called
- **THEN** the cart contains the product with quantity 2

#### Scenario: addItem increments quantity for duplicate product
- **WHEN** `addItem(product, 1)` is called twice for the same product
- **THEN** the cart contains the product with quantity 2

#### Scenario: removeItem removes a product from the cart
- **WHEN** `removeItem(product.id)` is called for an existing cart item
- **THEN** the product is no longer in the cart

#### Scenario: updateQuantity changes item quantity
- **WHEN** `updateQuantity(product.id, 5)` is called
- **THEN** the cart item's quantity is 5

#### Scenario: updateQuantity with zero removes the item
- **WHEN** `updateQuantity(product.id, 0)` is called
- **THEN** the item is removed from the cart

#### Scenario: clearCart empties the cart
- **WHEN** `clearCart()` is called with items in the cart
- **THEN** the cart is empty and itemCount is 0

#### Scenario: total reflects sum of price × quantity
- **WHEN** two products with known prices and quantities are in the cart
- **THEN** `total` equals the sum of (price × quantity) for all items

#### Scenario: sessionStorage persisted and restored
- **WHEN** `CartProvider` is unmounted and remounted
- **THEN** cart items are restored from sessionStorage

#### Scenario: useCart outside provider throws
- **WHEN** `useCart()` is called outside `CartProvider`
- **THEN** an error is thrown

### Requirement: AuthContext is covered by unit tests
`context/AuthContext.tsx` SHALL have unit tests covering initial null user state, setUser, logout (with a mocked fetch for the POST logout call), and the error thrown by `useAuth` outside a provider.

#### Scenario: Initial user is null
- **WHEN** `AuthProvider` is rendered without a pre-set user
- **THEN** `user` is `null`

#### Scenario: setUser stores the user
- **WHEN** `setUser({ id: 1, name: 'Test' })` is called
- **THEN** `user` reflects the provided value

#### Scenario: logout clears the user and calls the logout endpoint
- **WHEN** `logout()` is called
- **THEN** a POST request is made to the logout endpoint and `user` becomes `null`

#### Scenario: useAuth outside provider throws
- **WHEN** `useAuth()` is called outside `AuthProvider`
- **THEN** an error is thrown

### Requirement: ToastContext is covered by unit tests
`context/ToastContext.tsx` SHALL have unit tests with the `sonner` module mocked, verifying that `addToast` delegates to `toast.success`, `toast.error`, `toast.warning`, and `toast.info` with the correct message.

#### Scenario: success toast
- **WHEN** `addToast('Saved', 'success')` is called
- **THEN** `toast.success` is called with `'Saved'`

#### Scenario: error toast
- **WHEN** `addToast('Failed', 'error')` is called
- **THEN** `toast.error` is called with `'Failed'`

#### Scenario: warning toast
- **WHEN** `addToast('Check input', 'warning')` is called
- **THEN** `toast.warning` is called with `'Check input'`

#### Scenario: info toast
- **WHEN** `addToast('FYI', 'info')` is called
- **THEN** `toast.info` is called with `'FYI'`
