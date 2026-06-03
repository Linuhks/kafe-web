@AGENTS.md

# Kafe Web

Next.js 16.2.1 · React 19 · TypeScript · Tailwind 4

Coffee shop management platform — online menu for customers, live Kanban order queue for baristas, analytics and catalog management for admins. Consumes `kafe-api` (default `http://localhost:8080`).

## Roles and entry routes

| Role | Primary feature | Entry route |
|------|----------------|-------------|
| CLIENT | Menu catalog + cart + order history | `/cardapio` |
| BARISTA | Live order queue (Kanban, 15 s poll) | `/barista/queue` |
| ADMIN | Dashboard, catalog, inventory, users | `/admin/dashboard` |

Access control lives entirely in `proxy.ts` (middleware). Pages do not duplicate it.

## Critical files

| File | Purpose |
|------|---------|
| `app/globals.css` | All Kafe design-system tokens — colors, typography, spacing |
| `proxy.ts` | Auth middleware — role-based redirect, source of truth for access control |
| `lib/api/server-fetch.ts` | `serverFetch()` — authenticated server-side HTTP, reads `kafe_token` cookie |
| `lib/api/generated/api.ts` | Orval-generated React Query hooks — regenerate with `pnpm generate:api` |
| `context/` | AuthContext, CartContext (sessionStorage), ToastContext |
| `app/layout.tsx` | Provider tree: QueryProvider → AuthProvider → CartProvider → ToastProvider |
| `components/ui/` | Shadcn/Radix primitives — check here before building any new primitive |

## Design system

All tokens are CSS custom properties with `--kafe-*` prefix, exposed as Tailwind 4 utilities (`text-kafe-*`, `bg-kafe-*`, etc.).

**Brand palette — Material You, coffee-brown**

| Token | Value | Use |
|-------|-------|-----|
| `--kafe-primary` | `#553722` | Buttons, headings, key UI |
| `--kafe-secondary` | `#735a35` | Secondary actions, accents |
| `--kafe-surface` | `#fcf9f8` | Page backgrounds |
| `--kafe-surface-container-lowest` | `#ffffff` | Card surfaces |
| `--kafe-surface-container-low` | `#f6f3f2` | Subtle row fills, table headers |
| `--kafe-outline-variant` | `#d4c3ba` | Borders |
| `--kafe-error` | `#ba1a1a` | Destructive states |

**Typography utilities** (defined in `globals.css` via `@utility`)

`text-display` (120 px / 800) · `text-headline-lg` (32 px / 700) · `text-headline-md` (24 px / 600) · `text-body-lg` (18 px) · `text-body-md` (16 px) · `text-label-sm` (14 px / 600, tracked)

**Spacing tokens**: `--kafe-stack-sm` 0.5 rem · `--kafe-stack-md` 1.5 rem · `--kafe-stack-lg` 4 rem · `--kafe-margin-page` 2 rem

**Rules**
- Always merge classes with `cn()` from `lib/utils.ts`
- Icons: `lucide-react` only
- Forms: `react-hook-form` + `zod` + `zodResolver`
- Toasts: `useToast()` from `context/ToastContext` — types: `success | error | warning | info`

## Docs

- [Architecture](docs/architecture.md) — rendering model, auth flow, API layers, middleware
- [Code Guide](docs/code-guide.md) — conventions, data fetching patterns, styling, forms
- [Modules](docs/modules.md) — route map, component index, layouts, hooks
- [Workflow](docs/workflow-dev.md) — per-subtask gate, commit process, code standards
