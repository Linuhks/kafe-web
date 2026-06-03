## Why

The admin "New Product" form at `/admin/products/new` is a minimal, unstyled single-column form that has no visual relationship to the Kafe design system. This change redesigns it to match the Stitch-designed screen: two-column layout, live image preview, design-system inputs, pill toggle, and a polished CTA.

## What Changes

- Redesign `app/admin/products/new/page.tsx` to match the Stitch screen "Kafe New Product Form"
- Two-column layout: left col (Product Information card + Availability toggle card), right col (Product Image card with live preview + Create Product CTA)
- Replace shadcn `<Input>` fields with bare inputs styled with bottom-border (`border-b-2 border-outline-variant`) for name, price, and imageUrl; bordered textarea for description; native `<select>` with chevron overlay for category
- Add live image preview that updates in real time as the user types in the Image URL field
- Replace the plain checkbox for availability with a CSS pill toggle using `peer` utilities
- Replace the generic "Criar produto" `<Button>` with the full-width rounded `bg-primary-container` CTA from the Stitch design

## Capabilities

### New Capabilities

*(none — this is a UI redesign of an existing form)*

### Modified Capabilities

- `admin-product-management`: The create-product form UI requirements change to reflect the Stitch design (two-column layout, image preview, pill toggle, new CTA style, and design-system input styling).

## Impact

- `app/admin/products/new/page.tsx` — full page redesign (all logic preserved, only markup changes)
- No API or data changes; same fields, same mutation hooks, same validation
- Design tokens already present in Tailwind config (`primary`, `outline-variant`, `surface-container-*`, etc.)
