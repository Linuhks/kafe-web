## 1. Redesign create-category form (`new/page.tsx`)

- [x] 1.1 Replace shadcn `Button` import with inline `<button>` elements using Kafe classes
- [x] 1.2 Replace shadcn `Input` import with native `<input>` elements using Kafe underline style
- [x] 1.3 Apply `text-headline-md text-kafe-on-surface` to the "Nova categoria" heading
- [x] 1.4 Style the "Cancelar" button as outline: `border border-kafe-primary text-kafe-primary rounded-full px-6 py-2.5 text-label-sm`
- [x] 1.5 Wrap the form in `bg-kafe-surface-container-low rounded-xl p-8`
- [x] 1.6 Apply `text-label-sm text-kafe-on-surface-variant` to all field labels; style "(opcional)" with `text-kafe-on-surface-variant/60`
- [x] 1.7 Style the Nome, Descrição, and Ordem de exibição inputs with the underline style from the design system
- [x] 1.8 Style the "Criar categoria" submit button: `bg-kafe-primary text-kafe-on-primary rounded-full px-6 py-2.5 text-label-sm disabled:opacity-50 disabled:cursor-not-allowed`
- [x] 1.9 Replace `text-destructive` on the name error message with `text-kafe-error`

## 2. Redesign edit-category form (`[id]/edit/EditCategoryForm.tsx`)

- [x] 2.1 Replace shadcn `Button` import with inline `<button>` elements
- [x] 2.2 Replace shadcn `Input` import with native `<input>` elements using Kafe underline style
- [x] 2.3 Apply the same label, input, and button Kafe classes as in task 1.6–1.9
- [x] 2.4 Style the `isActive` checkbox with `accent-kafe-primary`
- [x] 2.5 Style the "Cancelar" button as outline (same as 1.4)
- [x] 2.6 Replace `text-destructive` with `text-kafe-error` on the name error message
- [x] 2.7 Wrap the form fields in `bg-kafe-surface-container-low rounded-xl p-8`

## 3. Verify

- [x] 3.1 Visually confirm both forms match the Kafe design system (underline inputs, rounded-full buttons, kafe tokens)
- [x] 3.2 Confirm validation error for empty Nome still appears with correct color
- [x] 3.3 Confirm submit button disables and shows "Salvando..." during pending state
- [x] 3.4 Confirm "Cancelar" triggers `confirmNavigation` and navigates back correctly
