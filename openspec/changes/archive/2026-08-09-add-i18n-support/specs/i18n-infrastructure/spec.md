## Purpose

Provides the shared mechanism every page and component uses to source user-facing text — a pt-BR message catalog plus the provider/hook wiring to read from it — so language is centralized instead of hardcoded per-component, and so a future language switch is a config change rather than a rewrite.

## ADDED Requirements

### Requirement: pt-BR message catalog is the single source of UI text
The system SHALL maintain a `messages/pt-BR.json` file containing every user-facing string rendered by the app (excluding proper nouns, brand names, and API-driven data such as product names). Components SHALL resolve text via translation hooks/functions rather than JSX string literals.

#### Scenario: New UI text is added via the catalog
- **WHEN** a developer adds a new user-facing string to a component
- **THEN** the string is added as a key in `messages/pt-BR.json` and referenced via `useTranslations()` (Client Components) or `getTranslations()` (Server Components), not written as a literal in JSX

#### Scenario: Existing English strings are migrated
- **WHEN** the app renders any page or shared component previously found to hardcode English text (dashboard, product listing/creation, login, checkout, order confirmation, TopNavBar, Footer, the dev-only design-system page, and the shared `Badge`/`Pagination`/`Dialog` primitives)
- **THEN** the rendered text is in Portuguese, sourced from `messages/pt-BR.json`

### Requirement: Message provider wraps the app
The system SHALL wrap the root layout in a message provider that loads `messages/pt-BR.json` and makes it available to both Server and Client Components without prop-drilling.

#### Scenario: Server Component reads a translation
- **WHEN** a Server Component (e.g. `app/admin/dashboard/page.tsx`) needs UI text
- **THEN** it can resolve a translation key without needing `'use client'`

#### Scenario: Client Component reads a translation
- **WHEN** a Client Component (e.g. `NavBar`, `ProductsTable`) needs UI text
- **THEN** it can resolve a translation key via a hook without prop-drilling the message catalog from a parent

### Requirement: Shared UI primitives source text from the catalog
`Badge`, `Pagination`, and `Dialog` SHALL resolve their user-facing text (order-status labels, "Previous"/"Next"/"Showing X–Y of Z", the default close-button label) from the message catalog instead of hardcoding it, so every consumer gets pt-BR automatically without each page having to override it.

#### Scenario: Badge shows Portuguese order status
- **WHEN** `<Badge status="RECEIVED" />` renders anywhere in the app, including the customer-facing `/orders/me` page
- **THEN** it displays "Recebido", not "Received" — matching the Portuguese labels already used by `AdminOrderQueueClient` and the barista queue

#### Scenario: Pagination controls are in Portuguese
- **WHEN** a paginated table or list renders pagination controls
- **THEN** "Previous"/"Next" render as "Anterior"/"Próximo" and the summary text renders as "Mostrando X–Y de Z itens"

#### Scenario: Dialog default close button is in Portuguese
- **WHEN** a `Dialog` renders with its default close affordance (not explicitly suppressed via `showCloseButton={false}`)
- **THEN** the close button's accessible name is "Fechar", not "Close"

### Requirement: en-US catalog is scaffolded for future use
The system SHALL include a `messages/en-US.json` file with the same key structure as `messages/pt-BR.json`, seeded with English values for at least the strings already known in English today (i.e. no net new translation work required to make this scaffold non-empty). A language switcher UI is explicitly **out of scope** for this change — this requirement only ensures adding one later does not require restructuring how components read text.

#### Scenario: en-US catalog has no missing keys
- **WHEN** `messages/en-US.json` is diffed against `messages/pt-BR.json` by key
- **THEN** every key present in `pt-BR.json` is also present in `en-US.json` (values may still equal the pt-BR fallback for content not yet translated to English)

### Requirement: Lint rule flags new hardcoded UI strings
The system SHALL add an ESLint rule (or equivalent static check) that flags string literals rendered directly in JSX text content, to prevent this inconsistency from being reintroduced.

#### Scenario: New hardcoded string is flagged
- **WHEN** a developer writes `<button>Save</button>` instead of `<button>{t('save')}</button>` in a component covered by the rule
- **THEN** `pnpm lint` reports an error
