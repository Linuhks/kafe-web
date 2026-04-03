# lib/

## API Client (Orval-generated)

- **File**: `lib/api/generated/api.ts` — **do not edit manually**, git-ignored
- **Regenerate**: `pnpm generate:api` (backend must be running at `localhost:3333`)
- Generates React Query hooks from OpenAPI schema at `localhost:3333/api/v1/docs-json`
- Uses `apiFetch` from `lib/api/fetcher.ts` as the mutator

## fetcher.ts

Custom fetch wrapper used by all generated hooks:
- Server-side: uses full URL `http://localhost:3333`
- Client-side: uses empty base URL (relies on Next.js `/api/v1/*` rewrite)
- Adds `Content-Type: application/json` for POST/PUT/PATCH
- Returns `{ data, status, headers }`

## Types (`lib/types/index.ts`)

Shared TypeScript types:
- `UserRole`: `'ADMIN' | 'BARISTA' | 'CLIENT'`
- `OrderStatus`: `'RECEIVED' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED'`
- `User`, `Category`, `Product`, `Order`, `OrderItem`, `Ingredient`, `StockMovement`
- `DashboardSummary`, `TopProduct`, `PeakHour`, `PaginatedResponse<T>`

## Utils (`lib/utils.ts`)

- `cn(...classes)`: merges Tailwind classes via `clsx` + `tailwind-merge`
