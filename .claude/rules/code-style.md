# Code style

Conventions for every file in this repo. Longer explanations and data-fetching patterns live in `docs/code-guide.md`.

## TypeScript

- Strict, **no `any`**. Use explicit types, `unknown` with narrowing, or the generated types from `lib/api/generated/api.ts`.
  ```typescript
  // ❌ const res: any = await fetch(...)
  // ✅ for unknown error shapes
  catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
  }
  ```
- Path alias `@/` resolves to the project root.

## File naming

| Type | Convention | Example |
|------|-----------|---------|
| Page | `page.tsx` | `app/admin/users/page.tsx` |
| Layout | `layout.tsx` | `app/admin/layout.tsx` |
| Route handler | `route.ts` | `app/api/auth/login/route.ts` |
| Component | `PascalCase.tsx` | `components/admin/UsersTable.tsx` |
| Hook | `camelCase.ts` | `hooks/usePolling.ts` |
| Utility / lib | `kebab-case.ts` | `lib/api/server-fetch.ts` |

## Server vs Client components

Default to **Server Components**. Add `'use client'` only when you need React state/effects, browser APIs (`window`, `document`), React Query hooks, or event handlers.

## Data fetching

- Server Components: `serverFetch` (reads the `kafe_token` cookie) or the manual modules in `lib/api/*.ts`.
- Client Components: the Orval-generated hooks. Regenerate with `pnpm generate:api` (backend running at `localhost:3333`); never edit `lib/api/generated/` by hand.

## Styling and UI

- Merge Tailwind classes with `cn()` from `lib/utils.ts`; never concatenate class strings manually.
- Use the `--kafe-*` design tokens from `app/globals.css` (exposed as `text-kafe-*`, `bg-kafe-*`, …) instead of hard-coded colors or spacing.
- Check `components/ui/` (Shadcn/Radix) before building a new primitive; add one only when it is genuinely absent.
- Icons: `lucide-react` only.

## Forms and feedback

- Forms: `react-hook-form` + `zod` + `zodResolver`.
- Toasts: `useToast()` from `context/ToastContext` — types `success | error | warning | info`.

## Text and i18n

User-facing strings go through `next-intl` (`useTranslations` in Client Components, `getTranslations` from `next-intl/server` in Server Components), with keys in both `messages/pt-BR.json` and `messages/en-US.json`. The two catalogs must keep the same keys (`messages/catalog.test.ts`), and `i18next/no-literal-string` flags literals in JSX. Don't add new hard-coded strings.

## Access control

A role check that only hides a link or button is UX, not access control. Gate routes and actions in `proxy.ts` (and, for data, in the API), never only in a component.
