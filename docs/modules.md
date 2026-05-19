# Modules

Route map and component index for `kafe-web`.

---

## Route map

| Route | Page file | Access | Description |
|-------|-----------|--------|-------------|
| `/` | `app/page.tsx` | Public | Home / landing |
| `/login` | `app/login/page.tsx` | Public | Login form (redirects if authenticated) |
| `/cardapio` | `app/cardapio/page.tsx` | Public | Menu catalog with cart |
| `/orders/me` | `app/orders/me/page.tsx` | Authenticated | Client's own order history |
| `/barista/queue` | `app/barista/queue/page.tsx` | BARISTA, ADMIN | Live order queue |
| `/admin/dashboard` | `app/admin/dashboard/page.tsx` | ADMIN | Sales summary, top products, peak hours |
| `/admin/categories` | `app/admin/categories/page.tsx` | ADMIN | Category list |
| `/admin/categories/new` | `app/admin/categories/new/page.tsx` | ADMIN | Create category |
| `/admin/categories/[id]/edit` | `app/admin/categories/[id]/edit/page.tsx` | ADMIN | Edit category |
| `/admin/products` | `app/admin/products/page.tsx` | ADMIN | Product list |
| `/admin/products/new` | `app/admin/products/new/page.tsx` | ADMIN | Create product |
| `/admin/products/[id]/edit` | `app/admin/products/[id]/edit/page.tsx` | ADMIN | Edit product |
| `/admin/inventory` | `app/admin/inventory/page.tsx` | ADMIN | Ingredient stock list |
| `/admin/inventory/[id]/restock` | `app/admin/inventory/[id]/restock/page.tsx` | ADMIN | Restock an ingredient |
| `/admin/inventory/movements` | `app/admin/inventory/movements/page.tsx` | ADMIN | Stock movement history |
| `/admin/users` | `app/admin/users/page.tsx` | ADMIN | User list |
| `/admin/users/new` | `app/admin/users/new/page.tsx` | ADMIN | Create user |
| `/admin/users/[id]/edit` | `app/admin/users/[id]/edit/page.tsx` | ADMIN | Edit user |

Access control is enforced by `proxy.ts` (middleware). Pages do not duplicate this check.

---

## Route Handlers (`app/api/`)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/auth/login` | Receives `{ token }` from frontend form, sets `kafe_token` httpOnly cookie |
| `POST` | `/api/auth/logout` | Deletes `kafe_token` cookie |
| `GET` | `/api/auth/session` | Returns current session user from cookie |

These handlers exist only to manage the cookie. Business logic stays in the backend.

---

## Components

### `components/admin/`

| Component | Description |
|-----------|-------------|
| `AdminSidebar` | Side navigation for all admin pages |
| `CategoriesTable` | Paginated table of categories with edit/delete actions |
| `ConfirmModal` | Generic confirmation dialog (delete flows) |
| `DataTable` | Generic sortable/paginated table primitive used by admin tables |
| `DateRangePicker` | `from` / `to` date input pair used in dashboard and movements filters |
| `IngredientFilter` | Dropdown filter by ingredient for movements page |
| `PeakHoursChart` | Bar chart of orders by hour of day |
| `ProductsTable` | Paginated table of products with availability toggle |
| `UsersTable` | Paginated table of users with role badge and activate/deactivate |

### `components/barista/`

| Component | Description |
|-----------|-------------|
| `InventoryAlertBanner` | Banner shown when any ingredient is below minimum stock |
| `OrderQueueCard` | Card for a single order in the barista queue; contains `StatusButton` |
| `StatusButton` | Button to advance an order's status; handles valid transitions |

### `components/catalog/`

| Component | Description |
|-----------|-------------|
| `CategoryTabs` | Horizontal tabs to filter products by category |
| `ProductCard` | Product display card with add-to-cart action |
| `CartSidebar` | Slide-in cart with item list, quantity controls, and place-order button |
| `OrderForm` | Form for client name and notes submitted with the cart |

### `components/layout/`

| Component | Description |
|-----------|-------------|
| `NavBar` | Top navigation bar; shows role-appropriate links and logout |

### `components/ui/`

Shadcn/Radix primitives — do not add new ones without a genuine gap:

`badge` · `button` · `dialog` · `input` · `pagination` · `select` · `skeleton` · `sonner`

---

## Layouts

| Layout file | Applies to | What it adds |
|-------------|-----------|--------------|
| `app/layout.tsx` | All routes | Provider tree, global styles |
| `app/admin/layout.tsx` | `/admin/*` | `AdminSidebar` + main content wrapper |
| `app/barista/layout.tsx` | `/barista/*` | Barista-specific header/wrapper |

---

## Hooks

| Hook | Location | Description |
|------|----------|-------------|
| `usePolling` | `hooks/usePolling.ts` | Calls a callback on a fixed interval; used on the barista queue to auto-refresh |
| `useFormDirty` | `lib/hooks/useFormDirty.ts` | Warns before leaving a page with unsaved form changes |
