## MODIFIED Requirements

### Requirement: Dashboard summary cards
The system SHALL display three summary cards: "Total de Pedidos" (Total Orders), "Receita Total" (Total Revenue), and "Ticket Médio" (Average Order Value). Values SHALL reflect the selected date range. Revenue and average SHALL be formatted as currency in `pt-BR` locale (BRL). Any date displayed alongside the summary (e.g. the selected range label) SHALL also be formatted using `pt-BR` locale, consistent with the currency formatting — not `en-US`.

#### Scenario: Summary loads with default date range
- **WHEN** an admin visits `/admin/dashboard` without URL params
- **THEN** summary cards show today's totals fetched from the backend, labeled "Total de Pedidos", "Receita Total", and "Ticket Médio"

#### Scenario: Summary updates on date range change
- **WHEN** the admin selects a custom date range via DateRangePicker
- **THEN** the page re-fetches and summary cards reflect the new range

#### Scenario: Dates render in pt-BR locale
- **WHEN** the dashboard renders any formatted date (e.g. alongside currency values)
- **THEN** the date is formatted using `pt-BR` locale conventions (e.g. "9 de agosto de 2026"), not `en-US` ("August 9, 2026")

### Requirement: Top products table
The system SHALL display a table titled "Produtos Mais Vendidos" (Best Selling Products) with columns: "Produto" (Product Name), "Qtd. Vendida" (Quantity Sold), "Receita" (Revenue). Data SHALL be fetched for the selected date range. When there is no data for the range, the system SHALL show an empty state with heading "Ainda sem dados de vendas" and supporting text "As vendas aparecerão aqui assim que os pedidos forem feitos."

#### Scenario: Table renders top products
- **WHEN** the dashboard loads
- **THEN** a table lists products ordered by quantity sold (descending) with revenue per product, under the columns "Produto", "Qtd. Vendida", "Receita"

#### Scenario: Empty state renders in Portuguese
- **WHEN** the selected date range has no sales data
- **THEN** the empty state shows "Ainda sem dados de vendas" and "As vendas aparecerão aqui assim que os pedidos forem feitos."
