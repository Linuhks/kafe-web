## Context

There is no i18n layer today — every user-facing string in `kafe-web` is a literal in JSX. The audit behind this change (see proposal.md) found the app is currently in three states: fully-Portuguese pages, fully-English pages, and pages that mix both in the same component. The app also has no `[locale]` route segment or any URL-based locale concept — `app/layout.tsx` sets `<html lang="pt">` and every route is unprefixed.

Two routes found fully in English — `/checkout` and `/checkout/confirmation` — are **not linked from anywhere in the live app**: the real checkout flow is the inline cart-drawer dialog on `/cardapio` (confirmed during e2e testing: add to cart → open drawer → "Finalizar Pedido" → confirm dialog → `POST /api/v1/orders`, no navigation to `/checkout` at all). These two routes are only reachable by typing the URL directly, and only `order-confirmation-page`/`checkout-page` specs and their own component tests reference them. They're still real, shippable routes with real specs, so this change still translates them — but they're lower priority than the pages that live users actually hit, and tasks.md sequences them last.

## Goals / Non-Goals

**Goals:**
- One source of truth for UI text (`messages/pt-BR.json`), with every component reading from it instead of hardcoding strings.
- Fix the specific English/mixed-language instances catalogued in the proposal, with zero regressions to existing (passing) tests beyond the string updates those same tests need to match the new pt-BR copy.
- Make a future language switch a matter of populating `messages/en-US.json` and flipping a config value — not restructuring how any component reads text.

**Non-Goals:**
- Shipping a language switcher UI. This change only avoids blocking one later.
- Adopting `[locale]`-prefixed routing (`/en/cardapio`, `/pt-BR/cardapio`). See "Decisions" below for why, and what a future switcher would actually need.
- Redesigning the `ProductsTable` category color-pill mapping. Its color map keys (`"Coffee Beans"`, `"Brewing Gear"`, `"Subscription"`) already don't match the real seeded categories (`Cafés`, `Bebidas Frias`, `Doces`, `Salgados`) today — every row already falls through to the neutral "other" color regardless of language. That's a pre-existing data/design mismatch bug, independent of translation, and is not fixed here.
- Rewriting the `/checkout` + `/checkout/confirmation` demo flow to connect to real cart/order data. They're translated as-is; their disconnection from the live app is a separate, pre-existing concern.

## Decisions

### Library: `next-intl`, no locale routing
Use `next-intl` (App Router-native, supports both Server and Client Components, the de facto standard for Next.js i18n). Configure it in **non-routing mode**: no `[locale]` segment, no middleware-based locale negotiation. `i18n/request.ts` returns a fixed locale (`pt-BR`) today; a root `NextIntlClientProvider` in `app/layout.tsx` wraps `children` once, giving every Client Component `useTranslations()` and every Server Component `getTranslations()` without prop-drilling.

**Why not locale-routing now**: `next-intl`'s routing mode requires every route to move under `app/[locale]/...`, which touches every existing route, every existing test's routing assumptions, and `proxy.ts`'s middleware logic — a large, invasive change with no user-facing payoff today (there's only one locale live). Non-routing mode gets the exact same `useTranslations`/`getTranslations` API contract; adding routing later is an additive change to `i18n/request.ts` and the middleware, not a rewrite of every page.

**Why not `react-i18next`**: weaker RSC support in the App Router (needs extra bridging for Server Components); `next-intl` is purpose-built for this router.

### Message catalog: one JSON file, namespaced by feature
`messages/pt-BR.json` (and the `messages/en-US.json` scaffold) is a single JSON file with top-level namespace keys matching the areas in the proposal's capability list — `nav`, `footer`, `badge`, `pagination`, `dialog`, `login`, `dashboard`, `productsList`, `productForm`, `inventoryList`, `checkout`, `orderConfirmation`, `designSystem` — each holding its own leaf keys. One file (not one-file-per-namespace) because the catalog is small enough today that split-file loading overhead isn't worth the indirection; revisit if it grows past a few hundred keys.

Not translated: proper nouns and brand names (Kafe, Google, Apple), product/category names driven by API data (already correct — they come from the database, not JSX), and the design-system page's illustrative example content ("Marcos V.", "Guatemalan Antigua", "Order #8842") which is placeholder data, not interface chrome.

### Shared primitives migrate first
`Badge`, `Pagination`, and `Dialog` are migrated before any page, because pages depend on them (e.g. `/orders/me` inherits `Badge`'s English status labels today) — migrating a page before its primitives would mean re-touching that page once the primitive catches up. Order: primitives → `i18n-infrastructure` lint rule → pages, high-traffic first (dashboard, products, login) → low-traffic last (`/checkout`, `/checkout/confirmation`, `/test-components`).

### Filter-chip labels track real category names, not a literal translation
`ProductsTable`'s category filter chips currently read "All Items, Coffee Beans, Brewing Gear, Gifts" — none of which match the real seeded categories (`Cafés`, `Bebidas Frias`, `Doces`, `Salgados`), so translating them word-for-word ("Grãos de Café", "Equipamentos de Preparo") would still be meaningless. The spec delta (`admin-product-listing-ui`) instead sets the chips to the real category names. This is the one place this change touches *which* string is shown, not just its language — called out explicitly since it's a step beyond pure translation.

### Lint enforcement: `eslint-plugin-i18next`
Add `eslint-plugin-i18next`'s `i18next/no-literal-string` rule (already a maintained, widely-used ESLint plugin for exactly this) rather than a hand-rolled rule. Scope it to `app/` and `components/` (excluding `*.test.tsx`, `components/ui/` primitives' internal class-name strings via the rule's `ignoreAttribute`/`ignoreCallee` options) so it flags new JSX text literals without false-positiving on `className`, `variant="outline"`, etc.

## Risks / Trade-offs

- **Every page migration touches its own tests** → mitigated by tasks.md sequencing test updates in the *same* subtask as the component change (per the project's existing per-subtask gate: `pnpm lint && pnpm build` before commit), never batched at the end — avoids a long red-test-suite window.
- **`getTranslations()` in Server Components vs `useTranslations()` in Client Components is easy to mix up** → mitigated structurally: the root layout wraps `children` in `NextIntlClientProvider` exactly once, so every component in the tree has access to the correct hook for its own type; a lint rule doesn't exist for this specific mistake, but it fails loudly at runtime (`useTranslations` throws outside the provider tree only for genuinely misplaced Client Components, which is rare given the provider is at the root).
- **`i18next/no-literal-string` false positives** → mitigated by scoping/ignoring known-safe attributes up front (see Decisions); expect to tune the ignore list once during rollout rather than getting it perfect on the first pass.
- **`/checkout` + `/checkout/confirmation` being dead routes today means low real-world payoff for translating them** → accepted trade-off: they're still specced, tested, and reachable by URL, so leaving them English would still be a real inconsistency; tasks.md just sequences them last so higher-traffic pages land first.

## Open Questions

- Should the future language switcher be cookie/localStorage-based (simplest: `next-intl` re-reads a cookie in `i18n/request.ts`, no URL change) or full `[locale]` route-prefixed (bigger lift, but URLs are shareable/SEO-indexable per language)? Doesn't affect this change's specs, approach, or tasks — the non-routing setup chosen here supports either path being added later without rework.
