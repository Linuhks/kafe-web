## 1. Logo Lockup

- [x] 1.1 Import `Coffee` and `Settings` icons from `lucide-react` in `AdminSidebar.tsx`
- [x] 1.2 Add the logo header section: `Coffee` icon in a `bg-[var(--kafe-primary)]` rounded square + "KAFE" wordmark beside it

## 2. Nav Redesign

- [x] 2.1 Update the active-link style to use `bg-[var(--kafe-secondary-container)]/20 text-[var(--kafe-primary)] font-bold` and inactive to `text-[var(--kafe-on-surface-variant)] hover:bg-[var(--kafe-surface-container-low)] hover:text-[var(--kafe-primary)]`
- [x] 2.2 Add a Settings nav entry (icon: `Settings`, label: "Configurações", href: `/admin/settings`) at the bottom of the nav list, styled as an inactive link (not an active-route candidate)

## 3. User Profile Footer

- [x] 3.1 Add local state (`user`, `loading`) and a `useEffect` that fetches `/api/auth/session` on mount, storing `{ name, role }` from the response
- [x] 3.2 Render a border-top separator and a Settings link row above the profile card
- [x] 3.3 Render the profile card: initials avatar (`div` with `bg-[var(--kafe-primary)] text-[var(--kafe-on-primary)]`), user's full name in `font-bold`, role label in muted uppercase
- [x] 3.4 Show `<Skeleton>` (from `components/ui/skeleton`) in the footer area while `loading === true`

## 4. Sidebar Shell Styling

- [x] 4.1 Update the `<aside>` wrapper: set background to `bg-[var(--kafe-surface-container-lowest)]`, right border to `border-[var(--kafe-outline-variant)]`, and ensure `flex-col h-screen` layout

## 5. Tests

- [x] 5.1 Update `AdminSidebar.test.tsx` to assert the logo "KAFE" wordmark is rendered
- [x] 5.2 Add a test asserting the user name and role appear after the session fetch resolves (mock `fetch`)
- [x] 5.3 Add a test asserting the `<Skeleton>` renders while the session fetch is pending
