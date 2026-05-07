## Context

The admin product management CRUD was partially implemented under an earlier change (archived 2026-05-06). All UI surfaces exist:

- `app/admin/products/page.tsx` — server-rendered list with DataTable, availability toggle, edit/delete actions
- `app/admin/products/new/page.tsx` — create form with validation and useFormDirty
- `app/admin/products/[id]/edit/page.tsx` — pre-filled edit form with inline ingredient management
- `components/admin/DataTable.tsx` — generic sortable/paginated table
- `components/admin/ConfirmModal.tsx` — delete confirmation dialog
- `lib/hooks/useFormDirty.ts` — unsaved-changes warning hook

The remaining gap: `lib/api/products.ts` only exports `getProducts` and `getProductById` (read-only server functions). The write-side operations — create, update, delete, toggle availability, and ingredient management — are called directly via generated React Query hooks inside the client components, bypassing the API module entirely.

## Goals / Non-Goals

**Goals:**
- Add write-side wrapper functions to `lib/api/products.ts` so all product API calls are centralized in one module
- Match the pattern established by `lib/api/users.ts` and `lib/api/orders.ts` (wrapper around generated functions)

**Non-Goals:**
- Changing any page or component behavior — UI is already correct
- Adding new pages or routes
- Changing the data model or backend API contract

## Decisions

**Add wrappers to lib/api/products.ts rather than refactoring components**
The components already work correctly using generated hooks. The wrapper functions are needed for consistency and potential server-side use, but there's no benefit in rewriting the client components to call them. Components calling generated hooks directly for mutations is a valid pattern; the wrappers serve as a thin server-callable layer.

**Keep generated hooks in client components**
React Query hooks (`useProductsControllerCreate`, etc.) cannot be used in Server Components. The wrappers in `lib/api/products.ts` are imperative async functions suitable for server-side calls or future server actions. No migration of client components needed.

## Risks / Trade-offs

- **Wrapper functions may go unused** → Client components already import generated hooks directly and work correctly. The wrappers add consistency but carry no runtime benefit unless server actions are added later.
