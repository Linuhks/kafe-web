## Context

`AdminSidebar` is a `'use client'` component at `components/admin/AdminSidebar.tsx`. It uses `usePathname()` for active-link highlighting and Lucide icons. The component is rendered by `app/admin/layout.tsx` and shared by all `/admin/*` routes. It currently has no branding, no user identity, and no visual alignment with the Kafe design system.

The Stitch design defines a sidebar with three zones:
1. **Header** — logo lockup (coffee icon + "KAFE" wordmark)
2. **Nav** — icon + label links, active state with `kafe-secondary-container` tint
3. **Footer** — Settings link + user profile card (avatar placeholder, name, role)

The `--kafe-*` CSS variables are already defined in `globals.css` and exposed to Tailwind 4 via `--color-kafe-*` theme tokens.

## Goals / Non-Goals

**Goals:**
- Visually align `AdminSidebar` with the Stitch admin dashboard design
- Show the Kafe brand logo at the top of the sidebar
- Show a Settings nav link before the user profile card
- Show the logged-in user's name and role in the sidebar footer
- Use existing `--color-kafe-*` tokens throughout; no new design tokens needed

**Non-Goals:**
- Collapsible/mobile sidebar (out of scope for this iteration)
- Changing sidebar width or layout structure in `app/admin/layout.tsx`
- Adding new routes or changing existing `/admin/*` routing

## Decisions

### Decision: Keep `'use client'` + `usePathname()`
Active-state highlighting requires `usePathname()`, which is client-only. No change needed here.

### Decision: Use Lucide icons, not Material Symbols font
The Stitch mockup uses Material Symbols, but adding a Google Fonts CSS import for icons would introduce a render-blocking external dependency. The project already has `lucide-react`. We map each nav item to the closest Lucide equivalent:
- Dashboard → `LayoutDashboard` (already used)
- Products → `Package` (already used)
- Categories → `Tag` (already used)
- Users → `Users` (already used)
- Inventory → `Archive` (already used)
- Settings → `Settings` (new, from lucide-react)
- Logo coffee → `Coffee` (new, from lucide-react)

### Decision: Fetch user from `/api/auth/session` inside the sidebar
The user profile (name + role) lives behind `/api/auth/session`. Since the sidebar is a client component, we fetch with a `useEffect` on mount and store the result in local state. No new custom hook is required — a single `fetch('/api/auth/session')` is enough. Show a skeleton while loading.

### Decision: Initials avatar, no external image
The session API does not currently return a profile image URL. We render a `div` with the user's initials using `kafe-primary` colors instead of an `<img>`. This avoids a broken-image fallback and keeps the component self-contained.

## Risks / Trade-offs

- **Session fetch on every mount** → for a fixed layout this fires once per navigation to any admin page. It is not a performance concern at this scale.
- **Lucide vs Material Symbols visual mismatch** → icons won't be pixel-perfect vs. the Stitch mockup, but the overall composition and palette will match. Acceptable trade-off.
