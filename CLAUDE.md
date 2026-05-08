@AGENTS.md

# Kafe Web

Next.js 16.2.1 · React 19 · TypeScript · Tailwind 4

## Stack

- **Backend**: `localhost:3333` — `/api/v1/*` rewrites to backend via `next.config.ts`
- **Auth**: JWT in `kafe_token` httpOnly cookie; roles: `ADMIN | BARISTA | CLIENT`
- **UI**: Shadcn/Radix components in `components/ui/`, icons via `lucide-react`
- **API client**: auto-generated React Query hooks via Orval (`lib/api/generated/api.ts`)

## Commands

```
pnpm dev           # start dev server
pnpm build         # production build
pnpm generate:api  # regenerate API hooks (fetches spec from deployed backend)
```

## Subfolder docs

@app/CLAUDE.md
@components/CLAUDE.md
@context/CLAUDE.md
@lib/CLAUDE.md
