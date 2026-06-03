## MODIFIED Requirements

### Requirement: Admin can create a product
The system SHALL provide a create-product form at `/admin/products/new` using the Kafe design system. The page SHALL render a two-column layout (`lg:grid-cols-12`): the left column (7 cols) contains a **Product Information** card (name, description, category, price fields) and an **Availability** card with a pill toggle; the right column (5 cols) contains a **Product Image** card with a live image preview that updates as the admin types in the Image URL field, and a full-width rounded **Create Product** CTA button. All inputs SHALL use bottom-border styling (`border-b-2 border-outline-variant`) except the description textarea which uses a full-border rounded style (`border border-outline-variant rounded-lg`). Labels SHALL use `font-label-sm text-label-sm text-kafe-primary uppercase`. The availability toggle SHALL be a pill-style CSS toggle (`peer` utilities, `w-14 h-8`, not a plain checkbox). A hint "DRAFTS ARE SAVED AUTOMATICALLY" SHALL appear below the CTA in `font-label-sm text-outline-variant uppercase tracking-widest`.

#### Scenario: Successful product creation
- **WHEN** the admin fills all required fields and submits
- **THEN** the system POSTs to the products API, shows a success toast, and redirects to `/admin/products`

#### Scenario: Validation error on submit
- **WHEN** the admin submits with missing required fields
- **THEN** inline validation errors appear beneath the relevant fields and no API call is made

#### Scenario: API error on create
- **WHEN** the API returns an error on submit
- **THEN** an error toast is shown and the form remains open with values preserved

#### Scenario: Live image preview updates
- **WHEN** the admin types a URL in the Image URL field
- **THEN** the preview `<img>` in the Product Image card reflects the entered URL in real time

#### Scenario: Availability toggle defaults to on
- **WHEN** the admin opens the New Product page
- **THEN** the availability pill toggle is in the checked (enabled) state
