## Why

The admin "Nova categoria" form uses generic shadcn/default styling that doesn't match the Kafe design system — inputs are box-bordered with neutral colors, buttons use a plain dark fill, and there is no use of kafe color tokens or typography utilities. Bringing this form into alignment with the design system improves visual consistency across all admin pages and avoids a two-tier look between newly redesigned pages and legacy forms.

## What Changes

- Replace shadcn `Input`, `Textarea`, and `Button` primitives with Kafe-styled equivalents (underline inputs, rounded-full buttons, kafe color tokens)
- Apply `text-label-sm text-kafe-on-surface-variant` to all field labels
- Style "Criar categoria" as a primary button (`bg-kafe-primary text-kafe-on-primary rounded-full`)
- Style "Cancelar" as an outline button (`border border-kafe-primary text-kafe-primary rounded-full`)
- Wrap the form in a `bg-kafe-surface-container-low rounded-xl` card
- Apply `text-headline-md text-kafe-on-surface` to the page heading "Nova categoria"
- Keep field names, validation rules, and API call unchanged — this is a visual-only change

## Capabilities

### New Capabilities
- `admin-category-form-ui`: Kafe-styled create-category form matching the design system

### Modified Capabilities
<!-- none — no requirement-level behavior changes -->

## Impact

- `app/admin/categorias/nova/page.tsx` (or equivalent route) — component markup and class names
- No API, routing, or auth changes
