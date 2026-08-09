## MODIFIED Requirements

### Requirement: Product listing displays a design-system–consistent page header
The system SHALL render the `/admin/products` page header with a left column containing the title "Catálogo de Produtos" (Product Inventory) in `text-headline-lg text-kafe-primary` and a descriptive subtitle in `text-body-md text-kafe-on-surface-variant`, and a right column containing the "Adicionar Produto" (Add New Product) CTA button styled as `bg-kafe-primary text-kafe-on-primary rounded-lg`.

#### Scenario: Header renders with title and CTA
- **WHEN** an admin navigates to `/admin/products`
- **THEN** the page displays "Catálogo de Produtos" as the heading and an "Adicionar Produto" button aligned to the right

### Requirement: Product listing table uses Kafe design tokens
The system SHALL render the products table inside a `bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl` wrapper, with a `bg-kafe-surface-container-low` header row and `text-label-sm uppercase tracking-wider text-kafe-on-surface-variant` header cells reading "Nome do Produto" (Product Name), "Categoria" (Category), "Preço" (Price), "Disponibilidade" (Availability), and "Ações" (Actions).

#### Scenario: Table container has correct visual treatment
- **WHEN** the products table is rendered
- **THEN** the outer wrapper has rounded corners, a border in `kafe-outline-variant`, and a contrasting header row background, with the header cells reading "Nome do Produto", "Categoria", "Preço", "Disponibilidade", "Ações"

### Requirement: Product listing has a search input and category filter chips
The system SHALL render a search input (with a search icon, placeholder "Buscar produtos…") and a row of category filter chips ("Todos", "Cafés", "Doces", "Salgados") above the table. Selecting a chip SHALL filter the visible rows client-side. Entering text in the search input SHALL filter rows by product name substring (case-insensitive), client-side. The footer row count text SHALL read "Mostrando X de Y produtos".

#### Scenario: Typing in search filters visible rows
- **WHEN** the admin types "espresso" in the search input
- **THEN** only rows whose product name contains "espresso" (case-insensitive) are shown

#### Scenario: Selecting a category chip filters rows
- **WHEN** the admin clicks the "Cafés" chip
- **THEN** only rows whose category is "Cafés" are visible and the chip is styled as active (`bg-kafe-primary text-kafe-on-primary`)

#### Scenario: Active chip is visually distinct
- **WHEN** a category chip is selected
- **THEN** it renders with `bg-kafe-primary text-kafe-on-primary` and other chips render with outline/surface styles

#### Scenario: All Items chip shows all rows
- **WHEN** the admin clicks the "Todos" chip
- **THEN** all rows are shown regardless of category

#### Scenario: Row count footer is in Portuguese
- **WHEN** the products table renders with results
- **THEN** the footer reads "Mostrando X de Y produtos"
