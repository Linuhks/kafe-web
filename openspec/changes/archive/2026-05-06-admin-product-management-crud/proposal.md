## Why

The admin panel currently has a dashboard and user management but no way to manage the product catalog. Admins need a full CRUD interface for products — including ingredient relationships and availability toggling — so they can maintain the menu without direct database access.

## What Changes

- New route group `app/admin/products/` with list, create, and edit pages
- New reusable `components/admin/DataTable.tsx` with sorting and pagination
- New `components/admin/ConfirmModal.tsx` for destructive action confirmations
- New `useFormDirty` hook that warns users on unsaved changes before navigating away
- Extended product API coverage: create, update, delete, toggle availability, and ingredient CRUD per product

## Capabilities

### New Capabilities

- `admin-product-management`: Full CRUD interface for products including listing with availability toggle, create/edit forms, delete with confirmation, and per-product ingredient management (add/remove ingredients with quantities)

### Modified Capabilities

<!-- No existing spec-level behavior changes -->

## Impact

- New pages: `app/admin/products/page.tsx`, `app/admin/products/new/page.tsx`, `app/admin/products/[id]/edit/page.tsx`
- New components: `components/admin/DataTable.tsx`, `components/admin/ConfirmModal.tsx`
- New hook: `lib/hooks/useFormDirty.ts`
- API layer: `lib/api/products.ts` extended with mutation functions
- Depends on: existing Shadcn UI primitives (task 2), API client foundation (task 5), auth middleware (task 7), admin layout (task 10)
