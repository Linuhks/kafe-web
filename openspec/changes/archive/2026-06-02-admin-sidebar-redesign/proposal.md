## Why

The `AdminSidebar` component is a bare-bones nav list with no branding, no user identity, and no visual hierarchy. The Stitch design establishes a rich sidebar that will be shared across all admin pages — it should carry the Kafe logo, a structured nav with Material Symbols icons, a Settings entry, and a user profile footer so admins always know who is logged in.

## What Changes

- Redesign `components/admin/AdminSidebar.tsx` to match the Stitch admin dashboard design
- Add Kafe logo lockup (coffee icon + "KAFE" wordmark) to the sidebar header
- Replace Lucide icons with Material Symbols Outlined to match the design system
- Add a Settings link at the bottom of the nav
- Add a user profile card at the sidebar footer (avatar, name, role) sourced from the session cookie
- Apply design-system color tokens (warm coffee palette already in `globals.css` / Tailwind config)

## Capabilities

### New Capabilities

_(none — sidebar already exists as a component)_

### Modified Capabilities

- `admin-dashboard`: Sidebar visual requirements expand to include logo lockup, Settings nav item, and user profile footer pulled from session data.

## Impact

- `components/admin/AdminSidebar.tsx` — full visual redesign, stays a `'use client'` component
- `app/admin/layout.tsx` — no structural changes needed (already renders `<AdminSidebar />`)
- Session data (name, role) must be readable client-side; the existing `/api/auth/session` route or a cookie read via a hook will supply it
- No API, route, or middleware changes
