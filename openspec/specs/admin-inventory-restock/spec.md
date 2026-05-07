## ADDED Requirements

### Requirement: Restock form for a single ingredient
The system SHALL render `/admin/inventory/[id]/restock` as a Client Component with a form containing: a required number input for quantity (positive values only, minimum 0.01) and an optional textarea for note. Submitting SHALL call `restockIngredient(id, { quantity, note })` and, on success, navigate to `/admin/inventory`. On failure, a toast error SHALL be shown.

#### Scenario: Successful restock submission
- **WHEN** the admin enters a positive quantity and submits the form
- **THEN** the restock API is called, a success toast is shown, and the user is redirected to `/admin/inventory`

#### Scenario: Form rejects non-positive quantity
- **WHEN** the admin enters zero or a negative number in the quantity field
- **THEN** the form does not submit and displays a validation error

#### Scenario: API failure shows error toast
- **WHEN** the restock API returns an error
- **THEN** a destructive toast is shown and the user remains on the restock form

#### Scenario: Note is optional
- **WHEN** the admin submits the form with quantity filled but note empty
- **THEN** the form submits successfully without a note
