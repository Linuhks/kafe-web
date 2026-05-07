## ADDED Requirements

### Requirement: Admin can list all users
The system SHALL display all registered users in a paginated DataTable. Each row SHALL show name, email, role badge (ADMIN / BARISTA / CLIENT), active status, and action buttons for edit and delete.

#### Scenario: List loads with users
- **WHEN** an ADMIN navigates to `/admin/users`
- **THEN** the page renders a table with at least one row per existing user, showing name, email, role badge, and active status

#### Scenario: Empty state
- **WHEN** no users exist in the system
- **THEN** the page renders an empty state message instead of a table

### Requirement: Admin can create a user
The system SHALL provide a form at `/admin/users/new` with fields for name, email, password, and role (ADMIN, BARISTA, CLIENT). Submitting SHALL call `POST /api/v1/users` and redirect to the list on success.

#### Scenario: Successful creation
- **WHEN** admin fills all required fields and submits the form
- **THEN** the user is created, a success toast is shown, and the admin is redirected to `/admin/users`

#### Scenario: Validation error
- **WHEN** admin submits with a missing required field or duplicate email
- **THEN** an error toast is shown and the form stays on the page

#### Scenario: Password field is present on create
- **WHEN** admin opens `/admin/users/new`
- **THEN** the form includes a password input field

### Requirement: Admin can edit a user
The system SHALL provide a form at `/admin/users/[id]/edit` with fields for name, email, role, and isActive toggle. The form SHALL NOT include a password field. Submitting SHALL call `PATCH /api/v1/users/:id` and refresh the list on success.

#### Scenario: Successful edit
- **WHEN** admin changes name or role and submits
- **THEN** the update is saved, a success toast is shown, and the list refreshes

#### Scenario: Toggle active status
- **WHEN** admin toggles the isActive switch and submits
- **THEN** the user's active status is updated accordingly

#### Scenario: Password field is absent on edit
- **WHEN** admin opens `/admin/users/[id]/edit`
- **THEN** the form does NOT include a password input field

#### Scenario: Unsaved changes warning
- **WHEN** admin modifies a field and tries to navigate away without saving
- **THEN** the browser or router shows a confirmation prompt about unsaved changes

### Requirement: Admin can delete a user
The system SHALL show a confirmation modal before deleting a user. Confirming SHALL call `DELETE /api/v1/users/:id`, show a success toast, and refresh the user list.

#### Scenario: Delete with confirmation
- **WHEN** admin clicks delete on a user row and confirms in the modal
- **THEN** the user is deleted and removed from the list with a success toast

#### Scenario: Delete cancelled
- **WHEN** admin clicks delete but dismisses the confirmation modal
- **THEN** no deletion occurs and the list remains unchanged

### Requirement: Form dirty guard
The system SHALL use a `useFormDirty` hook that tracks whether a form has unsaved changes and warns the user before navigation away.

#### Scenario: Guard triggers on browser unload
- **WHEN** a form has unsaved changes and the user attempts to close or reload the tab
- **THEN** the browser's native beforeunload dialog is shown

#### Scenario: Guard triggers on router navigation
- **WHEN** a form has unsaved changes and the user clicks a nav link
- **THEN** a confirmation prompt warns about unsaved changes before navigating
