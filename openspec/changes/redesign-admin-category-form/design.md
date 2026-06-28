## Context

Two category forms exist — `app/admin/categories/new/page.tsx` (create) and `app/admin/categories/[id]/edit/EditCategoryForm.tsx` (edit). Both use shadcn `Input` and `Button` primitives with default Tailwind classes. The rest of the admin area has already been migrated to Kafe design tokens (see product listing). This is a visual-only migration; all state management, validation logic, and API calls remain unchanged.

## Goals / Non-Goals

**Goals:**
- Apply Kafe design tokens to both the create and edit category forms
- Match the form input style from `app/test-components/page.tsx` (underline inputs, rounded-full buttons)
- Keep page structure (header with cancel, form card, submit row) identical to the current layout

**Non-Goals:**
- Migrating to `react-hook-form` + `zod` — the existing `useState` + manual `validate()` approach works and is out of scope
- Changing field names, validation rules, or API contracts
- Updating the category list page or any other admin page

## Decisions

### Inline Kafe classes over shadcn primitives

The `test-components/page.tsx` reference uses raw HTML elements styled directly with Kafe utilities. The shadcn `Input`/`Button` components carry their own default styles that would need to be overridden. For forms this simple (no compound behavior), removing the shadcn wrapper and applying classes inline is cleaner and avoids specificity conflicts.

**Alternatives considered**: keeping shadcn and passing className — rejected because shadcn Button applies `inline-flex` and icon padding that conflicts with `rounded-full`; shadcn Input adds a fixed ring/border that must be reset.

### Underline style for text and number inputs

Kafe's design system reference uses an underline input (`border-b border-kafe-outline-variant`) for text fields. This is used for Nome, Descrição, and Ordem de exibição — consistent with the design system's "Form Inputs" section.

### Checkbox stays unstyled for now

The edit form has an `isActive` checkbox. Kafe does not yet define a design-system checkbox. The checkbox will receive minimal Kafe styling (`accent-kafe-primary`) and remain otherwise unchanged.

### Error messages use `text-kafe-error`

Replacing `text-destructive` (shadcn token) with `text-kafe-error` aligns with the Kafe error color (`#ba1a1a`).

## Risks / Trade-offs

- [Divergence from shadcn] Removing shadcn `Input`/`Button` means these forms no longer benefit from shadcn accessibility patterns (e.g., `focus-visible` ring via shadcn). Mitigation: the underline inputs include explicit `focus:border-kafe-primary` and `outline-none` which covers keyboard focus visibility.
- [Edit form checkbox] The `isActive` checkbox lacks a Kafe-system analog. Mitigation: deferred — `accent-kafe-primary` is a minimal, non-breaking improvement.
