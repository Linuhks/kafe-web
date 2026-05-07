## Why

The admin panel needs a user management interface so administrators can view, create, update, and deactivate user accounts without direct database access. This is a core operational requirement for managing staff roles (BARISTA, ADMIN) and customer accounts.

## What Changes

- New `lib/api/users.ts` module with CRUD functions: `getUsers`, `getUserById`, `createUser`, `updateUser`, `deleteUser`
- New `app/admin/users/page.tsx` — server component listing all users in a DataTable with role badges, active status, and edit/delete actions
- New `app/admin/users/new/page.tsx` — client component form for creating users with name, email, password, and role
- New `app/admin/users/[id]/edit/page.tsx` — client component form for editing users (name, email, role, isActive toggle; no password field)
- New `useFormDirty` hook to warn on unsaved changes
- `ConfirmModal` used for delete confirmation

## Capabilities

### New Capabilities
- `admin-user-management`: Full CRUD for user accounts — list with filtering, create with password, edit metadata and role, toggle active status, delete with confirmation

### Modified Capabilities

## Impact

- New routes under `app/admin/users/`
- New API module `lib/api/users.ts`
- Depends on existing admin layout (`app/admin/`) and auth middleware enforcing ADMIN role
- Depends on Shadcn UI primitives: DataTable, Badge, Select, Dialog (ConfirmModal), Toggle
