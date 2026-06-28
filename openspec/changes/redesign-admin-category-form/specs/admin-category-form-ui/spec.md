## ADDED Requirements

### Requirement: Page header uses Kafe typography tokens
The create-category page header SHALL use `text-headline-md text-kafe-on-surface` for the "Nova categoria" title and an outline button styled with `border border-kafe-primary text-kafe-primary rounded-full` for the "Cancelar" action.

#### Scenario: Page renders with Kafe heading
- **WHEN** an admin navigates to `/admin/categories/new`
- **THEN** the heading "Nova categoria" is rendered with `text-headline-md text-kafe-on-surface` classes

#### Scenario: Cancel button renders as outline
- **WHEN** the page loads
- **THEN** the "Cancelar" button has `border border-kafe-primary text-kafe-primary rounded-full` classes and no filled background

### Requirement: Form fields use Kafe underline input style
All text and number inputs in both the create and edit forms SHALL use the Kafe underline style: `bg-transparent border-b border-kafe-outline-variant focus:border-kafe-primary outline-none py-2 text-body-md text-kafe-on-surface placeholder:text-kafe-on-surface-variant/50 transition-colors`.

#### Scenario: Nome field renders with underline style
- **WHEN** the create-category form renders
- **THEN** the Nome input has a bottom border only (no box border), and the border changes to `kafe-primary` on focus

#### Scenario: Descrição field renders with underline style
- **WHEN** the create-category form renders
- **THEN** the Descrição input uses the same underline classes as Nome

#### Scenario: Ordem de exibição field renders with underline style
- **WHEN** the create-category form renders
- **THEN** the number input for sort order uses the underline style

### Requirement: Labels use Kafe label tokens
Field labels SHALL use `text-label-sm text-kafe-on-surface-variant` and optional hints SHALL use `text-kafe-on-surface-variant/60`.

#### Scenario: Nome label renders correctly
- **WHEN** the form renders
- **THEN** the "Nome" label has `text-label-sm text-kafe-on-surface-variant` classes

#### Scenario: Optional hint renders with muted color
- **WHEN** the form renders
- **THEN** "(opcional)" appears in a muted tone using `text-kafe-on-surface-variant/60`

### Requirement: Submit button uses Kafe primary style
The submit button ("Criar categoria" / "Salvar alterações") SHALL use `bg-kafe-primary text-kafe-on-primary rounded-full px-6 py-2.5 text-label-sm` and SHALL be `disabled` while the mutation is pending.

#### Scenario: Submit button renders primary style
- **WHEN** the form is ready and no mutation is pending
- **THEN** the submit button has `bg-kafe-primary text-kafe-on-primary rounded-full` classes

#### Scenario: Submit button shows loading state
- **WHEN** the mutation is in flight (`isPending` is true)
- **THEN** the button is disabled and shows "Salvando..."

### Requirement: Form is wrapped in a Kafe surface card
The form container SHALL use `bg-kafe-surface-container-low rounded-xl p-8` to provide the card appearance matching the design system.

#### Scenario: Form renders inside surface card
- **WHEN** the create-category page renders
- **THEN** the form is wrapped in a container with `bg-kafe-surface-container-low rounded-xl` classes

### Requirement: Validation errors use Kafe error token
Inline field validation messages SHALL use `text-label-sm text-kafe-error` instead of shadcn's `text-destructive`.

#### Scenario: Name required error renders with Kafe error color
- **WHEN** the form is submitted with an empty Nome field
- **THEN** the error message "Nome é obrigatório." renders with `text-kafe-error` class

### Requirement: Edit form mirrors the same Kafe styling
The `EditCategoryForm` component SHALL apply the identical Kafe styling (underline inputs, primary submit, outline cancel, surface card wrapper, Kafe error token) as the create form.

#### Scenario: Edit form inputs render with underline style
- **WHEN** an admin navigates to `/admin/categories/[id]/edit`
- **THEN** all text/number inputs in the edit form use the Kafe underline style

#### Scenario: Edit form cancel button renders as outline
- **WHEN** the edit form renders
- **THEN** the "Cancelar" button has `border border-kafe-primary text-kafe-primary rounded-full` classes
