## Context

The admin panel already has a working layout, dashboard, and user management (tasks 10, 9). Products are served read-only via Orval-generated hooks and used in the customer catalog. This change adds write paths for products and exposes ingredient-product relationships that exist in the backend but have no frontend surface.

The stack is Next.js (server + client components), Shadcn UI, and React Query via Orval-generated hooks. The backend exposes product CRUD and ingredient linking at `/api/v1/products` and `/api/v1/products/:id/ingredients`.

## Goals / Non-Goals

**Goals:**
- Full product CRUD accessible from `/admin/products`
- Per-product ingredient management (link/unlink with quantity)
- Reusable `DataTable` component usable by future admin list pages
- Prevent accidental data loss via `useFormDirty` unsaved-changes warning

**Non-Goals:**
- Ingredient inventory/stock management (separate concern)
- Bulk product operations
- Image upload (imageUrl is a plain text field pointing to an external URL)
- Real-time availability sync with the catalog page

## Decisions

**Server Component for list page, Client Components for forms**
Product list data is fetched server-side in `app/admin/products/page.tsx` for fast initial render and SEO neutrality. Create/edit pages are Client Components because they require controlled form state, validation, and dirty tracking.

Alternative considered: full SWR/React Query client-side list. Rejected because the list doesn't need optimistic updates and server fetch avoids an extra loading skeleton flash.

**DataTable as a generic reusable component**
`components/admin/DataTable.tsx` accepts typed columns + rows and handles sorting and pagination internally. This pattern is already implied by the existing `admin-user-management` work and avoids rebuilding it per page.

**useFormDirty as a standalone hook**
Isolating dirty-state logic into `lib/hooks/useFormDirty.ts` keeps forms clean and makes the `beforeunload` listener reusable. The hook compares current form values against the initial snapshot using deep equality.

**ConfirmModal via existing Dialog primitive**
`components/admin/ConfirmModal.tsx` wraps Shadcn's `Dialog` with a standardized destructive-action layout (title, description, Cancel / Confirm buttons). Avoids browser `window.confirm` which can't be styled.

**Ingredient management inline on the edit page**
Adding/removing ingredients happens in the edit form rather than a separate route, keeping the workflow in one place and avoiding an extra navigation step for a common admin task.

## Risks / Trade-offs

- **Stale product list after mutations** → Invalidate React Query cache on successful create/update/delete using `queryClient.invalidateQueries`. Server-rendered list page will reflect changes on next navigation.
- **useFormDirty false positives on number fields** → Normalize values to the same type before comparison (e.g. price as string in form, number in API payload).
- **DataTable re-render cost on large catalogs** → Acceptable at current scale; virtualization deferred to a future change if needed.

## Open Questions

- Should availability toggle on the list page call the API inline (optimistic) or navigate to edit? Decision: inline API call with React Query mutation — faster workflow for a common admin operation.
