## Why

The current login page uses a generic layout that doesn't reflect Kafe's brand identity. Replacing it with a split-panel design — editorial left panel with brand photography and copy, clean form on the right — elevates the first impression and aligns the auth experience with the product's artisanal coffee positioning.

## What Changes

- Replace `app/login/page.tsx` with a new two-column layout (visual narrative left / form right)
- Add Plus Jakarta Sans font and Material Symbols Outlined icon font via Next.js font loading
- Extend Tailwind config with the full Kafe Material-You color palette and custom spacing/radius tokens
- Implement password visibility toggle as client-side React state
- Add parallax mouse-move effect on the hero image (desktop only)
- Add grain overlay texture via CSS
- Add Google and Apple social login buttons (UI only — wire-up deferred to auth provider tasks)
- Add "Create an account" and "Forgot Password?" links (routing TBD)

## Capabilities

### New Capabilities

- `login-page-redesign`: New split-panel login UI with brand photography, Kafe color system, social login buttons, and micro-interactions

### Modified Capabilities

<!-- No existing spec-level behavior changes — this is purely a UI replacement -->

## Impact

- `app/login/page.tsx` — full replacement
- `tailwind.config.ts` or `app/globals.css` — new color/spacing tokens must be added
- `app/layout.tsx` or font config — Plus Jakarta Sans and Material Symbols fonts
- No API or auth logic changes
