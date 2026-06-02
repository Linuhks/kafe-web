## Context

The current `app/login/page.tsx` is a functional but visually plain centered form. The project uses Tailwind v4 (CSS-variable-based theming via `@theme` in `globals.css`), Next.js font loading via `next/font/google`, and React Hook Form + Zod for form logic. The new design introduces a split-panel layout with a hero image on the left and a styled form on the right, requiring new color tokens, a new font, an icon font, and a parallax mouse effect.

## Goals / Non-Goals

**Goals:**
- Replace the login page layout with the split-panel design
- Add Plus Jakarta Sans font scoped to the login page (or globally if it doesn't conflict)
- Add Material Symbols Outlined icon font for the password toggle and submit button icons
- Extend `globals.css` with the Kafe Material-You color palette as Tailwind v4 CSS variables
- Preserve all existing form logic (React Hook Form, Zod validation, auth flow, role-based redirect)
- Password visibility toggle via `useState`
- Parallax mouse-move effect on the hero image (desktop, client-side)

**Non-Goals:**
- Google / Apple OAuth integration — buttons are UI-only placeholders
- "Create an account" and "Forgot Password?" routing — links render but don't navigate to real routes yet
- Dark mode support for the new tokens — the design is light-mode only

## Decisions

### 1. Color tokens: add to `globals.css`, not a separate file

The project already defines all tokens in `globals.css` under `:root` and `@theme inline`. The new Material-You palette (`--kafe-primary`, `--kafe-surface`, etc.) will be added there as a scoped block, prefixed with `kafe-` to avoid colliding with the existing shadcn/radix tokens. Tailwind v4 picks them up automatically via `@theme inline`.

**Alternative considered:** A separate `login.module.css` — rejected because it would duplicate the token pattern and wouldn't integrate with Tailwind utility classes.

### 2. Plus Jakarta Sans: loaded via `next/font/google` in `app/layout.tsx`

Added alongside the existing Geist fonts as `--font-jakarta` CSS variable, then referenced in `globals.css` or directly in the component. This follows the established pattern in the project and avoids a `<link>` tag.

**Alternative considered:** Load only in a `app/login/layout.tsx` — would avoid polluting the global font stack, but Plus Jakarta Sans is a reasonable brand font to have available globally. The root layout is the simpler path.

### 3. Material Symbols Outlined: loaded via `<link>` in a login-specific layout

`next/font` doesn't support variable icon fonts. The cleanest approach is to create `app/login/layout.tsx` that renders the Google Fonts `<link>` for Material Symbols via Next.js `<head>` metadata. This scopes the icon font to the login route only.

**Alternative considered:** `react-material-symbols` npm package — adds a dependency for a single page; the `<link>` approach is lighter.

### 4. Hero image: `next/image` with remote domain configured

The hero image URL is from `lh3.googleusercontent.com`. `next/image` requires explicit remote domain allowlisting in `next.config.ts`. Use `next/image` with `fill` and `object-cover` to match the CSS behavior.

**Alternative considered:** Plain `<img>` — loses optimization and LCP benefits.

### 5. Grain overlay: CSS `background-image` with a local SVG data URI

The original uses an external texture URL. Replace with an inline SVG noise pattern as a CSS `background-image` on a `::before` pseudo-element or a `<div>`, avoiding an external request and ensuring it always loads. Alternatively, a small local PNG in `public/` works too.

### 6. Parallax effect: `useEffect` + `mousemove` listener, no library

Simple enough to implement with a ref and a `mousemove` handler. Clean up on unmount to avoid memory leaks. Since the page is already `'use client'`, no additional boundary needed.

## Risks / Trade-offs

- **Token naming collision**: The `kafe-` prefix guards against shadcn conflicts, but must be applied consistently to all new tokens. → Mitigation: define all 30+ tokens in one block and use search to verify no clashes.
- **External image domain**: `lh3.googleusercontent.com` is a Google CDN — the image URL in the mock may not persist. → Mitigation: replace with a local placeholder image in `public/images/login-hero.jpg` and document the replacement.
- **`app/layout.tsx` font change**: Adding Plus Jakarta Sans affects the global `<html>` element. If other pages use the Geist variable font stack, they won't be affected (Geist is applied via `font-family: var(--font-geist-sans)` in `body`). The Jakarta variable is only used where explicitly applied. → Low risk.

## Migration Plan

1. Add Kafe color tokens + spacing/radius variables to `globals.css`
2. Add Plus Jakarta Sans to `app/layout.tsx`
3. Create `app/login/layout.tsx` with Material Symbols `<link>`
4. Update `next.config.ts` to allowlist `lh3.googleusercontent.com` (or swap to local image)
5. Rewrite `app/login/page.tsx` with the new layout, preserving all form logic
6. Manual smoke test: login flow still works end-to-end after the visual change

Rollback: `git revert` the login page commit. The token additions to `globals.css` are additive and harmless to leave.

## Open Questions

- Should Plus Jakarta Sans replace Geist globally as the brand font, or only on the login page? (Current decision: global variable, local application — revisit if brand guidelines demand a full swap.)
- The "Create an account" and "Forgot Password?" links need final route paths once those pages exist.
