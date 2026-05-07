## 1. API Module

- [x] 1.1 Create `lib/api/users.ts` with `getUsers(query?)`, `getUserById(id)` using `apiFetch` (server-side pattern from `lib/api/orders.ts`)

## 2. Shared Hook and Modal

- [x] 2.1 Create `lib/hooks/useFormDirty.ts` — tracks form dirty state, attaches `beforeunload` handler, and exposes a `confirmNavigation` callback for router-level guard
- [x] 2.2 Create `components/admin/ConfirmModal.tsx` — wraps Shadcn `Dialog` with a confirm/cancel pair and a customisable message prop

## 3. User List Page

- [x] 3.1 Create `app/admin/users/page.tsx` (Server Component) — fetch users via `getUsers()`, render DataTable with name, email, role badge, active status, edit link, and delete button
- [x] 3.2 Add role badge rendering: ADMIN = destructive, BARISTA = secondary, CLIENT = outline (reuse Shadcn `Badge`)
- [x] 3.3 Wire delete button to `ConfirmModal`; on confirm call `usersControllerRemove` mutation and `router.refresh()`

## 4. Create User Page

- [x] 4.1 Create `app/admin/users/new/page.tsx` (Client Component) — form with name, email, password, and role select using `CreateUserDto`
- [x] 4.2 Wire form submit to `usersControllerCreate` mutation; on success show success toast and `router.push('/admin/users')`
- [x] 4.3 Show error toast on mutation failure; keep form on page

## 5. Edit User Page

- [x] 5.1 Create `app/admin/users/[id]/edit/page.tsx` (Client Component) — fetch user via `getUserById(id)` in a server component wrapper or `useUsersControllerFindOne`, render form with name, email, role select, isActive toggle — NO password field
- [x] 5.2 Wire form submit to `usersControllerUpdate` mutation; on success show toast and call `router.refresh()` then `router.push('/admin/users')`
- [x] 5.3 Integrate `useFormDirty` hook on both create and edit forms

## 6. Navigation

- [x] 6.1 Verify `AdminSidebar` already links to `/admin/users` (it does — no change needed; confirm nav highlights correctly)
