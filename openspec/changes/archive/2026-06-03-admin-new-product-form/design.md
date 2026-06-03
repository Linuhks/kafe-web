## Context

The existing `/admin/products/new` page is a minimal `max-w-lg` single-column form using shadcn `<Input>`, `<Select>`, and a plain checkbox for availability. It functions correctly — hooks, validation, dirty-form guard, toast, and mutation all work — but has no visual relationship to the Kafe design system used on the rest of the admin and storefront.

A Stitch screen ("Kafe New Product Form") defines the target design: two-column layout, bottom-border inputs, live image URL → preview, pill toggle for availability, and a large rounded CTA.

## Goals / Non-Goals

**Goals:**
- Redesign `app/admin/products/new/page.tsx` to match the Stitch screen in structure and token usage
- Preserve all existing logic: `useProductsControllerCreate`, `useCategoriesControllerList`, `useFormDirty`, `useToast`, validation
- Use only existing design tokens from the Tailwind config (no new CSS variables or custom classes)

**Non-Goals:**
- Edit form (`/admin/products/[id]/edit`) — separate change
- Any API or data model changes
- Adding file-upload; image remains URL-based

## Decisions

### Keep it a single-file page component
The design adds a live-preview image and a styled toggle but introduces no cross-cutting logic. Extracting subcomponents (e.g. `ProductImageCard`) would be premature — the form only exists in one place. All UI lives in the single `page.tsx`.

**Alternative considered:** Extract a `NewProductForm` client component so the page can remain a server component. Rejected because the form already owns all its state; adding a server wrapper buys nothing here.

### Bottom-border inputs via inline Tailwind (no new component)
The design uses bottom-border-only text inputs (`border-b-2 border-outline-variant`) rather than the full-border shadcn `<Input>`. Apply these classes directly to bare `<input>` elements. The shadcn `<Input>` stays in use elsewhere in the admin; this page opts out.

**Alternative considered:** New `<KafeInput>` component. Rejected — only this page needs the style.

### Pill toggle via pure-CSS checkbox hack (no new dependency)
The Stitch design uses a pill toggle for availability. Implement with the same CSS-only pattern from the Stitch HTML: a hidden `<input type="checkbox">` + styled `<div>` using `peer` Tailwind utilities (`w-14 h-8 bg-surface-variant peer-checked:bg-kafe-primary`). No new library needed.

### Live image preview: controlled `<img>` bound to imageUrl state
The preview tile updates as the user types the URL. Use the existing `imageUrl` state to set `<img src={imageUrl || ''} />`. No debounce — the design doesn't suggest lazy loading.

### Native `<select>` with Material Symbol chevron overlay
The Stitch design shows a bottom-border select with a custom chevron. Implement with a native `<select>` wrapped in a `relative` container + `material-symbols-outlined expand_more` positioned absolutely. This drops the shadcn `<Select>` dependency for this field while matching the visual exactly.

## Risks / Trade-offs

- [Broken image on partial URL] → Acceptable; user sees a broken image icon while typing. No fallback placeholder is specified in the design.
- [Admin layout mismatch] → The page sits inside `app/admin/layout.tsx` which adds the `AdminSidebar`. The Stitch design shows a storefront nav (not the admin shell). The redesigned page content matches the Stitch layout *within* the admin shell; the surrounding sidebar is the shell's responsibility.
