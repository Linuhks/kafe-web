## Context

The admin panel already has a dashboard, sidebar with nav links to `/admin/users`, and an established pattern for server-component pages with client-component forms. The generated API (`lib/api/generated/api.ts`) already exposes `usersControllerList`, `usersControllerCreate`, `usersControllerFindOne`, `usersControllerUpdate`, and `usersControllerRemove` hooks, plus `CreateUserDto` / `UpdateUserDto` types. The manual API module pattern (`lib/api/orders.ts`) is used for server-side fetches that can't use React Query hooks.

## Goals / Non-Goals

**Goals:**
- List page (server component) with DataTable showing name, email, role badge, active status, edit and delete actions
- Create form (client component) with name, email, password, and role select
- Edit form (client component) with name, email, role, and isActive toggle — no password field
- `useFormDirty` hook to guard unsaved changes
- `ConfirmModal` for delete with optimistic UI feedback via toast

**Non-Goals:**
- Password reset flow (separate concern)
- Bulk user operations
- User impersonation

## Decisions

**Server Component list page + client component forms**
Consistent with the existing admin dashboard pattern (`app/admin/dashboard/`). The list page fetches data server-side via `lib/api/users.ts` (mirror of `lib/api/orders.ts`), giving SSR and no loading flash. Edit/create pages are client components because they need form state, React Query mutations, and toast feedback.

**Manual `lib/api/users.ts` module (not Orval hooks in page)**
Server components can't use React Query hooks. `lib/api/users.ts` wraps `apiFetch` directly — the same pattern used by `lib/api/orders.ts`. Client pages use the Orval-generated mutation hooks directly for create/update/delete.

**Separate create vs edit route (not a shared modal)**
A dedicated route per action keeps the URL bookmarkable and avoids a large shared modal. The password field difference between create and edit is clearer in separate files.

**`useFormDirty` as a shared hook in `lib/hooks/`**
Navigation guard logic is reusable across future admin forms. A lightweight `beforeunload` + `useRouter` intercept covers both cases.

**`ConfirmModal` as a local Dialog wrapper**
Reuses the Shadcn `Dialog` primitive already present in `components/ui/`. No new primitive needed.

## Risks / Trade-offs

- [Role escalation] Admin can promote any user to ADMIN — this is intentional and mirrors the backend permission model, but carries operational risk → Mitigation: backend enforces auth; UI shows current user's own role as read-only if self-editing
- [Password on create] Password is sent in plain JSON to the backend — no client-side hashing → Mitigation: backend is responsible for bcrypt hashing; connection uses HTTPS in production
- [Stale list after mutations] After create/update/delete the list page (server component) needs a full navigation or `router.refresh()` → Mitigation: after mutation success, call `router.refresh()` to re-run the server-side fetch
