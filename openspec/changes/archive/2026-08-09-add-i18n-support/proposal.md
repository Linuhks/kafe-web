## Why

An end-to-end audit (triggered by e2e testing with `/e2e-test`) found that roughly a third of the app's user-facing text is hardcoded in English while the rest — and the product's actual audience — is pt-BR: the admin Dashboard, the Products list/new-product form, the login page, and the checkout/confirmation demo pages are fully English; several shared primitives (`Badge`, `Pagination`, `Dialog`'s default close button) silently leak English into otherwise-Portuguese screens (e.g. the customer-facing `/orders/me` page shows order status as "Received" instead of "Recebido"); and a few components (`ProductsTable`, the checkout page) mix both languages in the same view. There is currently no i18n layer at all — every string is a literal in JSX — so there's no mechanical way to keep this consistent, and no path to ever offering a language switch. This change fixes the inconsistency now and puts real infrastructure under it so it doesn't regress and so a future EN/PT-BR switcher is a config change, not a rewrite.

## What Changes

- Introduce an i18n library (`next-intl`, App Router-native, RSC + Client Component support — see design.md for the choice) with a `messages/pt-BR.json` catalog as the single source of truth for all UI strings.
- Replace every hardcoded English (or mixed English/Portuguese) string identified in the audit with a translation key resolved from the pt-BR catalog, across: `app/admin/dashboard`, `app/admin/products` (list + new-product form), `app/login`, `app/checkout` + `app/checkout/confirmation`, `app/test-components` (dev-only design-system page), and the shared components `ProductsTable`, `TopNavBar`, `Footer`, `Badge`, `Pagination`, `Dialog`.
- Fix two bugs uncovered alongside the language issue: `app/admin/dashboard/page.tsx`'s `formatDate()` calls `toLocaleDateString('en-US', ...)` while `formatCurrency()` already uses `'pt-BR'` (inconsistent locale); the checkout and order-confirmation pages hardcode `$` (USD) instead of `R$` (BRL).
- Scaffold (but do not fully populate) an `en-US` message catalog and the routing/negotiation config needed to add a language switcher later — **out of scope for this change** to actually expose a switcher in the UI; this change only makes it a matter of translating `messages/en-US.json` and flipping a config flag, not restructuring components.
- **BREAKING**: none for end users (output is the same UI, now in one consistent language). For contributors: new UI strings must be added to `messages/pt-BR.json` and referenced via `useTranslations()`/`getTranslations()` instead of being written as JSX literals — enforced by an ESLint rule (see design.md).

## Capabilities

### New Capabilities
- `i18n-infrastructure`: the `next-intl` setup (provider, message loading, `useTranslations`/`getTranslations` usage in Server and Client Components), the pt-BR message catalog structure and naming convention, the `en-US` scaffold for future use, and the shared-primitive (`Badge`, `Pagination`, `Dialog`) requirement to source text from the catalog instead of hardcoding it.

### Modified Capabilities
Only capabilities whose spec **literally pins English copy** as a requirement are listed — `admin-product-management` and `login-page-redesign` describe fields/behavior abstractly (no literal strings in the requirement text) and so need no delta even though the pages they cover are being translated.

- `admin-dashboard`: summary card labels, empty states, and table headers currently specified in English must render in pt-BR; date formatting must use `pt-BR` locale consistently with currency formatting (fixes the `formatDate`/`formatCurrency` locale mismatch).
- `admin-product-listing-ui`: page header, table headers, search placeholder, and filter chip labels currently specified in English must render in pt-BR.
- `admin-inventory-list`: the "LOW STOCK" badge currently specified in English must render in pt-BR ("ESTOQUE BAIXO"), consistent with the rest of the (already Portuguese) page.
- `login-page-test-coverage`: every literal English string this test-coverage spec currently pins (headings, button/link/toast/validation text, aria-labels) must be updated to the pt-BR string it will assert against once the login page is translated.
- `checkout-page`: all section labels, field labels, and CTA copy currently specified in English must render in pt-BR; currency display must use `R$`/BRL formatting instead of `$`/USD.
- `order-confirmation-page`: all copy currently specified in English must render in pt-BR; currency display must use `R$`/BRL formatting instead of `$`/USD.
- `shared-layout-components`: `TopNavBar` and `Footer` nav/link labels currently specified in English must render in pt-BR.
- `design-system-page`: the dev-only `/test-components` page's nav labels and remaining English field labels currently specified in English must render in pt-BR, for consistency with the rest of that same page (its Order States section is already correctly Portuguese).

## Impact

- **Affected code**: every file listed in "What Changes" above, plus a new `messages/pt-BR.json` (and `messages/en-US.json` scaffold), a new `i18n/request.ts` (or equivalent `next-intl` config) and root layout changes to load the message provider.
- **Dependencies**: adds `next-intl` (or the chosen alternative, see design.md) as a new runtime dependency.
- **No backend/API changes** — this is entirely a kafe-web concern; API responses (order status enums like `RECEIVED`) are already correctly mapped to Portuguese labels in most places today (`AdminOrderQueueClient`, `OrderQueueCard`, barista queue) — this change makes `Badge` do the same instead of being the one place that doesn't.
- **Test impact**: existing component/unit tests that assert on the current (English) strings for the files above will need their expected strings updated to pt-BR as part of the same subtask that changes the component (see tasks.md).
