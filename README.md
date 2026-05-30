# Kafe Web

Frontend for the **Kafe** platform — a coffee shop management application with an online menu, real-time order queue, and admin dashboard.

Consumes the `kafe-api` REST backend and exposes a role-based UI for three user types: **CLIENT**, **BARISTA**, and **ADMIN**.

---

## Features

| Role | Access |
|------|--------|
| **Client** | Menu with cart, order history |
| **Barista** | Live order queue, status advancement |
| **Admin** | Sales dashboard, products, categories, inventory, users |

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + Shadcn/Radix UI |
| Server state | TanStack React Query v5 |
| Forms | react-hook-form + Zod |
| Icons | lucide-react |
| API generation | Orval (React Query hooks from OpenAPI) |
| Unit tests | Vitest + Testing Library |
| E2E tests | Playwright |

---

## Prerequisites

- Node.js 20+
- pnpm 10+
- `kafe-api` running locally (default: `http://localhost:8080`)

---

## Installation

```bash
pnpm install
```

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Testing

```bash
# Unit tests
pnpm test:unit

# Coverage
pnpm test:coverage

# E2E
pnpm test:e2e

# E2E with interactive UI
pnpm test:e2e:ui
```

---

## Build

```bash
pnpm build
pnpm start
```

Or via Docker:

```bash
docker build -t kafe-web .
docker run -p 3000:3000 kafe-web
```

---

## Documentation

- [Architecture](docs/architecture.md) — rendering model, auth flow, API layers, middleware
- [Code Guide](docs/code-guide.md) — conventions, data fetching patterns, styling, forms
- [Modules](docs/modules.md) — route map, component index, layouts, hooks
- [Workflow](docs/workflow-dev.md) — per-subtask gate, commit process, code standards
