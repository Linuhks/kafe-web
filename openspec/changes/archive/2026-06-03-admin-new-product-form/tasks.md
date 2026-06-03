## 1. Page Layout

- [x] 1.1 Replace the `max-w-lg` single-column wrapper with a `max-w-7xl` full-width container matching the admin page padding
- [x] 1.2 Add the page `<header>` section with `<h1>New Product</h1>` and subtitle "Add a new artisanal selection to the Kafe catalog.", separated by `border-b border-kafe-outline-variant`
- [x] 1.3 Convert the `<form>` to `grid grid-cols-1 lg:grid-cols-12 gap-gutter-grid items-start`

## 2. Left Column — Product Information Card

- [x] 2.1 Wrap the name, description, category, and price fields in a `bg-kafe-surface-container-lowest p-stack-md rounded-xl border border-kafe-outline-variant/30` card with an `<h2>Product Information</h2>` heading
- [x] 2.2 Replace the shadcn `<Input>` for product name with a bare `<input>` using bottom-border style (`border-b-2 border-kafe-outline-variant`) and `font-label-sm text-label-sm text-kafe-primary uppercase` label
- [x] 2.3 Replace the shadcn `<Input>` for description with a `<textarea rows={4}>` using full-border rounded style (`border border-kafe-outline-variant p-4 rounded-lg`)
- [x] 2.4 Place category and price in a `grid grid-cols-2 gap-gutter-grid` sub-grid; replace shadcn `<Select>` with a native `<select>` using bottom-border style and a `material-symbols-outlined expand_more` chevron overlay; replace price `<Input>` with a bare `<input type="number">` with `$` prefix
- [x] 2.5 Preserve inline validation error messages beneath each field

## 3. Left Column — Availability Card

- [x] 3.1 Replace the checkbox + label with a separate `bg-kafe-surface-container-low rounded-xl border border-kafe-outline-variant/30` card containing title "Availability", subtitle "Toggle product visibility in the shop", and a pill toggle on the right
- [x] 3.2 Implement the pill toggle as a hidden `<input type="checkbox">` + styled `<div>` using `peer` utilities (`w-14 h-8 bg-kafe-surface-variant peer-checked:bg-kafe-primary` + sliding `after:` pseudo-element)

## 4. Right Column — Product Image Card

- [x] 4.1 Wrap the image preview and URL input in a `bg-kafe-surface-container-lowest p-stack-md rounded-xl border border-kafe-outline-variant/30` card with an `<h2>Product Image</h2>` heading
- [x] 4.2 Render an `aspect-square` preview container with `<img src={imageUrl} />` that updates live as `imageUrl` state changes
- [x] 4.3 Replace the shadcn `<Input>` for image URL with a bare `<input type="url">` using bottom-border style with label "IMAGE URL"

## 5. Right Column — CTA

- [x] 5.1 Replace the existing submit `<Button>` with a `w-full bg-kafe-primary-container text-kafe-on-primary py-6 rounded-full` button containing "Create Product" text and a `chevron_right` Material Symbol icon
- [x] 5.2 Add the "DRAFTS ARE SAVED AUTOMATICALLY" hint text below the CTA (`text-center font-label-sm text-label-sm text-kafe-outline-variant uppercase tracking-widest`)
- [x] 5.3 Preserve `isPending` loading state on the button (disable + show spinner text while mutating)
