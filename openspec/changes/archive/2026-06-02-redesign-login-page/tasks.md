## 1. Tokens & Fonts

- [x] 1.1 Add Kafe Material-You color palette as `kafe-*` CSS variables to `:root` block in `app/globals.css`
- [x] 1.2 Add spacing and border-radius tokens (`--kafe-stack-sm`, `--kafe-stack-md`, `--kafe-stack-lg`, `--kafe-gutter-grid`, `--kafe-margin-page`, `--kafe-radius-lg`, `--kafe-radius-xl`) to `app/globals.css`
- [x] 1.3 Expose all new tokens in the `@theme inline` block of `app/globals.css` so they are available as Tailwind utility classes
- [x] 1.4 Add Plus Jakarta Sans via `next/font/google` in `app/layout.tsx` as CSS variable `--font-jakarta`

## 2. Login Layout Shell

- [x] 2.1 Create `app/login/layout.tsx` that renders a Material Symbols Outlined `<link>` tag via Next.js metadata `<head>` and wraps `{children}`
- [x] 2.2 Add `lh3.googleusercontent.com` to `remotePatterns` in `next.config.ts` to allow `next/image` to optimize the hero image (or place a local hero image in `public/images/login-hero.jpg` and use that instead)

## 3. Login Page Rewrite

- [x] 3.1 Replace the outer layout div in `app/login/page.tsx` with the two-column `<main>` (left visual panel hidden on mobile, right form panel)
- [x] 3.2 Build the left visual panel: full-bleed `next/image` with overlay div, KAFE wordmark, tagline copy, and subtext
- [x] 3.3 Build the right form panel: mobile KAFE wordmark, "Welcome back" heading, subtext
- [x] 3.4 Migrate the existing email and password fields into the new form layout, preserving `register`, `errors`, and `handleSubmit` wiring
- [x] 3.5 Add password visibility toggle using `useState<boolean>` — swap input `type` and icon text (`visibility` / `visibility_off`) on click
- [x] 3.6 Add "Forgot Password?" anchor and "New to Kafe? Create an account" anchor (href="#" placeholders)
- [x] 3.7 Add social login button row (Google + Apple, `type="button"`, no onClick handler)
- [x] 3.8 Add "or join the club" divider between form and social buttons
- [x] 3.9 Add grain overlay `<div>` (fixed, full-screen, z-50, pointer-events-none) with CSS grain texture
- [x] 3.10 Add footer "© 2024 Kafe Roastery. All rights reserved." at the bottom of the form panel

## 4. Parallax Effect

- [x] 4.1 Add a `ref` to the hero `<img>` (or `next/image` wrapper div) in the left panel
- [x] 4.2 Add a `useEffect` that attaches a `mousemove` listener on `document`, computes X/Y offset (max ±15px, scaled from viewport fraction), and applies `transform: scale(1.1) translate(Xpx, Ypx)` to the image ref
- [x] 4.3 Clean up the event listener in the `useEffect` return function

## 5. Validation & Smoke Test

- [x] 5.1 Verify TypeScript compiles without errors (`pnpm tsc --noEmit`)
- [x] 5.2 Start the dev server and confirm the login page renders the two-panel layout on desktop viewport
- [x] 5.3 Confirm the login page renders correctly on mobile viewport (left panel hidden, KAFE wordmark shown)
- [x] 5.4 Submit the form with invalid inputs and confirm Zod validation messages appear
- [x] 5.5 Submit with valid test credentials and confirm the auth flow completes and redirects to the correct dashboard
