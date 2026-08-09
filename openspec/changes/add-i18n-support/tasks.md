## 1. i18n infrastructure

- [x] 1.1 Add `next-intl` as a dependency (`pnpm add next-intl`)
- [x] 1.2 Create `messages/pt-BR.json` with empty namespace objects: `nav`, `footer`, `badge`, `pagination`, `dialog`, `login`, `dashboard`, `productsList`, `inventoryList`, `checkout`, `orderConfirmation`, `designSystem`
- [x] 1.3 Create `i18n/request.ts` returning a fixed `pt-BR` locale and loading `messages/pt-BR.json` (non-routing `next-intl` config per design.md)
- [x] 1.4 Wrap `app/layout.tsx`'s `children` in `NextIntlClientProvider`, sourced from `i18n/request.ts`
- [x] 1.5 Verify one Server Component (`getTranslations`) and one Client Component (`useTranslations`) can both resolve a test key end to end before migrating real content

## 2. Shared primitives (migrate before any page)

- [x] 2.1 `components/ui/badge.tsx`: replace the hardcoded `statusLabels` map with `badge.status.*` keys (Recebido, Em preparo, Pronto, Entregue, Cancelado — matching the labels already used by `AdminOrderQueueClient`/`OrderQueueCard`/barista queue)
- [x] 2.2 `components/ui/pagination.tsx`: replace "Previous"/"Next"/"Showing X–Y of Z items" and their aria-labels with `pagination.*` keys ("Anterior"/"Próximo"/"Mostrando X–Y de Z itens")
- [x] 2.3 `components/ui/dialog.tsx`: replace the default close-button `sr-only` text and `DialogFooter`'s fallback "Close" button with `dialog.close` ("Fechar")
- [x] 2.4 Update `app/orders/me/page.tsx` — verify `<Badge status={...} />` now renders "Recebido" not "Received" (no code change expected here, just confirms 2.1 fixed the leak)
- [x] 2.5 Run `pnpm lint && pnpm build`, fix any break, commit

## 3. Lint enforcement

- [ ] 3.1 Add `eslint-plugin-i18next`, configure `i18next/no-literal-string` scoped to `app/**/*.tsx` and `components/**/*.tsx`, excluding `*.test.tsx` and `components/ui/*` internal class-name-only strings (per design.md's ignore-list approach)
- [ ] 3.2 Run `pnpm lint` against the current (partially migrated) codebase, confirm it flags the English strings still pending in section 4+ (expected failures at this point — do not fix them here, just confirm the rule catches them)
- [ ] 3.3 Commit the lint config with the still-expected failures noted in the commit body, so later subtasks can point back to "this is the rule catching what section N fixes"

## 4. Admin Dashboard (`app/admin/dashboard/page.tsx`)

- [ ] 4.1 Replace summary card labels ("Total Orders"/"Total Revenue"/"Average Ticket" → `dashboard.summary.*`)
- [ ] 4.2 Replace top-products table title and column headers ("Best Selling Products"/"Product"/"Qty. Sold"/"Revenue" → `dashboard.topProducts.*`)
- [ ] 4.3 Replace "Overview" heading, "Notifications" aria-label, and both empty states ("No sales data yet…", "Awaiting Hourly Traffic…") → `dashboard.*`
- [ ] 4.4 Fix `formatDate()` to use `'pt-BR'` locale instead of `'en-US'` (matches `admin-dashboard` spec delta's date-formatting scenario)
- [ ] 4.5 Update `admin-dashboard`'s existing component test(s) to assert the new pt-BR strings
- [ ] 4.6 Run `pnpm lint && pnpm build`, fix any break, commit

## 5. Admin Products listing (`app/admin/products/page.tsx`, `components/admin/ProductsTable.tsx`)

- [ ] 5.1 Translate page header ("Product Inventory"/"Add New Product"/subtitle → `productsList.header.*`)
- [ ] 5.2 Translate `ProductsTable` column headers ("Product Name"/"Category"/"Price"/"Availability"/"Actions" → `productsList.table.*`) and footer row-count text
- [ ] 5.3 Translate search placeholder and replace filter chip labels with real category names per the `admin-product-listing-ui` spec delta ("Todos"/"Cafés"/"Doces"/"Salgados" instead of "All Items"/"Coffee Beans"/"Brewing Gear"/"Gifts") — **do not** touch the category pill-badge color mapping (out of scope, see design.md)
- [ ] 5.4 Update `ProductsTable`'s existing test(s) to assert the new pt-BR strings and new chip labels
- [ ] 5.5 Run `pnpm lint && pnpm build`, fix any break, commit

## 6. Admin new/edit product form (`app/admin/products/new/page.tsx`)

- [ ] 6.1 Translate all field labels, helper text, and button states ("New Product"/"Name"/"Description"/"Category"/"Price"/"Availability"/"Create Product"/"Saving…" → `productForm.*`) — note: this page's capability (`admin-product-management`) has no spec delta since the spec never pinned literal copy, so no spec file changes here, just the component and its test
- [ ] 6.2 Update the page's existing test(s) (if any) to assert the new pt-BR strings
- [ ] 6.3 Run `pnpm lint && pnpm build`, fix any break, commit

## 7. Admin Inventory list (`app/admin/inventory/page.tsx`)

- [ ] 7.1 Replace the "LOW STOCK" badge text with "ESTOQUE BAIXO" (`inventoryList.status.low`) — page is otherwise already Portuguese
- [ ] 7.2 Update the page's existing test(s) to assert "ESTOQUE BAIXO"
- [ ] 7.3 Run `pnpm lint && pnpm build`, fix any break, commit

## 8. Login page (`app/login/page.tsx`)

- [ ] 8.1 Translate all copy, placeholders, and button/link labels ("Welcome back"/"Sign in to continue…"/"Sign In"/"Forgot Password?"/"Create an account"/"or join the club"/footer copyright/hero alt text → `login.*`)
- [ ] 8.2 Translate Zod validation messages ("Invalid email"/"Password must be at least 8 characters" → `login.validation.*`)
- [ ] 8.3 Translate toast messages ("Invalid email or password"/"Login failed. Please try again." → `login.toast.*`) and the show/hide-password aria-labels
- [ ] 8.4 Translate the pending-state button text ("Signing in…")
- [ ] 8.5 Update `openspec/specs/login-page-test-coverage` implementation — i.e. update the actual test file(s) backing that spec to assert every pt-BR string listed in this change's `login-page-test-coverage` spec delta
- [ ] 8.6 Run `pnpm lint && pnpm build`, fix any break, commit

## 9. Checkout page (`app/checkout/page.tsx`) — lower priority, unreachable from the live app today (see design.md)

- [ ] 9.1 Translate the three numbered section headings and all field labels (Contact/Shipping/Payment sections → `checkout.*`)
- [ ] 9.2 Translate the "Confirm Purchase" CTA and order-summary sidebar heading/price-breakdown row labels
- [ ] 9.3 Fix hardcoded `$` to `R$`/BRL formatting throughout the order summary sidebar (per the `checkout-page` spec delta)
- [ ] 9.4 Update the page's existing test(s) to assert the new pt-BR strings and BRL formatting
- [ ] 9.5 Run `pnpm lint && pnpm build`, fix any break, commit

## 10. Order confirmation page (`app/checkout/confirmation/page.tsx`) — lower priority, same reason as section 9

- [ ] 10.1 Translate the success hero, order status card (including the "Received → Roasting → Ready" step labels → "Recebido → Torrando → Pronto"), order summary card, pickup location card, support callout, and footer actions
- [ ] 10.2 Fix hardcoded `$` to `R$`/BRL formatting in the order summary card
- [ ] 10.3 Update the page's existing test(s) to assert the new pt-BR strings and BRL formatting
- [ ] 10.4 Run `pnpm lint && pnpm build`, fix any break, commit

## 11. Shared layout components used by checkout/confirmation (`components/layout/TopNavBar.tsx`, `components/layout/Footer.tsx`)

- [ ] 11.1 Translate `TopNavBar` nav links ("Shop"/"Roastery"/"Our Story"/"Locations" → "Loja"/"Torrefação"/"Nossa História"/"Unidades")
- [ ] 11.2 Translate `Footer` links and copyright text
- [ ] 11.3 Update any existing tests for these two components
- [ ] 11.4 Run `pnpm lint && pnpm build`, fix any break, commit

## 12. Dev-only design-system page (`app/test-components/`) — lowest priority, internal reference only

- [ ] 12.1 Translate the sticky nav header links (reuses the `nav.*` keys from section 11 where labels match)
- [ ] 12.2 Translate the Form Inputs section ("Email Address"/"Order Observations" → `designSystem.*`)
- [ ] 12.3 Translate the Navigation Shells sidebar mock ("Your Selection" → "Sua Seleção", nav items → "Cafés"/"Doces"/"Salgados")
- [ ] 12.4 Translate the Composite Cards section's interface chrome only — CTA/badge text ("Add to Selection"/"MEMBERSHIP"/"Subscribe Now" → "Adicionar à Seleção"/"ASSINATURA"/"Assinar Agora"); leave illustrative example content ("Marcos V.", "Guatemalan Antigua", "Order #8842", "The Ritualist") untranslated per design.md
- [ ] 12.5 Translate the footer (reuses `footer.*` keys from section 11)
- [ ] 12.6 Update any existing tests for this page
- [ ] 12.7 Run `pnpm lint && pnpm build`, fix any break, commit

## 13. en-US scaffold and final verification

- [ ] 13.1 Create `messages/en-US.json` with the same key structure as `messages/pt-BR.json`, seeded with the original English strings recovered from this change's diffs (no new translation work — every string here was English before this change)
- [ ] 13.2 Add a script or test asserting `en-US.json` and `pt-BR.json` have identical key sets (per the `i18n-infrastructure` spec's "en-US catalog has no missing keys" scenario)
- [ ] 13.3 Run the full suite: `pnpm lint`, `pnpm build`, `pnpm test:unit`, `pnpm test:e2e` — confirm everything is green
- [ ] 13.4 Grep `app/` and `components/` for any remaining hardcoded English strings the audit may have missed; fix or file a follow-up if out of scope
- [ ] 13.5 Update this change's status and prepare for `/opsx:apply` archive once all tasks are checked off
