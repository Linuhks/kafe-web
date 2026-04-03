# context/

## Provider Order (in `app/layout.tsx`)

```
QueryProvider → AuthProvider → CartProvider → ToastProvider
```

## Contexts

### AuthContext
- State: `user: User | null`
- Hook: `useAuth()` → `{ user, setUser, logout }`
- `logout()` POSTs to `/api/auth/logout` and clears user state

### CartContext
- State: cart items with quantities
- Persisted in `sessionStorage` (key: `kafe_cart`) — survives page reload, not tab close
- Hook: `useCart()` → `{ items, total, itemCount, addItem, removeItem, updateQuantity, clearCart }`

### ToastContext
- Thin wrapper over Sonner
- Hook: `useToast()` → `{ addToast(message, type) }`
- Types: `'success' | 'error' | 'warning' | 'info'`

### QueryProvider
- Initializes React Query `QueryClient`
- No hook — just wraps the tree
