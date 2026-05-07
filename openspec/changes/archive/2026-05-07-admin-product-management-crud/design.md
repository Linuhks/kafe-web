## Context

The admin section needs a product management interface. Products are the core catalog entity: they have a name, description, price, image, category, and availability flag. Products also link to inventory ingredients (many-to-many with quantity), which feeds stock depletion logic. Prior to this change, only read operations existed on the frontend.

The admin UI pattern established by the dashboard and user management changes uses Server Components for data fetching at the page level, with `'use client'` Client Components for interactivity (forms, modals, toggles).

## Goals / Non-Goals

**Goals:**
- Full CRUD for products via the admin UI
- Inline availability toggle from the list page (no page reload)
- Ingredient linking on the edit page (add/remove with quantities)
- Reusable `DataTable` component for sortable, paginated admin tables
- Dirty-form protection (`useFormDirty`) reusable by future admin forms

**Non-Goals:**
- Bulk operations (bulk delete, bulk availability toggle)
- Image upload (imageUrl is a plain text field pointing to an external URL)
- Category management (separate task)
- Inventory stock level editing from the product page

## Decisions

### Server Component for the list page, Client Component for forms

The list page (`/admin/products`) fetches data server-side and passes it to a client table component. This avoids a loading state flash on initial render.

The new/edit forms are Client Components because they own interactive state (field values, validation errors, dirty tracking). Alternative considered: route-handler + server action. Rejected — the generated Orval hooks already provide mutation state (`isPending`, `onError`) that matches our UX needs with less boilerplate.

### ProductsTable wraps DataTable rather than extending it

`DataTable` is a generic, data-agnostic component (sortable columns, pagination). `ProductsTable` owns product-specific logic (availability toggle mutation, delete confirmation wiring). This keeps `DataTable` reusable across users, orders, etc. without leaking domain logic into it.

### Availability toggle is optimistic on the client

The toggle calls the API and updates local state immediately, reverting on failure. The alternative (wait for API then re-fetch) introduces a visible delay for a simple boolean flip that is disproportionate to the operation's cost.

### Ingredient management lives on the edit page, not a separate route

Ingredients are a sub-resource of a product and are only relevant in the context of editing that product. A separate route would fragment the flow. Adding a new product and immediately linking ingredients in two separate navigations creates unnecessary friction.

### `useFormDirty` hook for navigation protection

Centralises `beforeunload` registration and an in-app `confirmNavigation` helper so dirty-form logic doesn't leak into individual page components. Built as a standalone hook so user management, category management, and any future admin forms can reuse it without duplication.

## Risks / Trade-offs

- **Stale ingredient list after add/remove** → Mitigated by calling `refetchProductIngredients()` on mutation success rather than invalidating the whole query cache, keeping the list in sync without a full page reload.
- **Price as string type** → The backend DTO accepts `price` as a string (decimal). The form uses `type="number"` for UX but submits the string value directly. This avoids floating-point precision issues at the cost of a slightly unusual type contract.
- **No skeleton loaders on edit page** → The edit page shows a simple "Carregando..." text while waiting for the product query. A skeleton would improve perceived performance but adds complexity for a low-traffic admin page.
