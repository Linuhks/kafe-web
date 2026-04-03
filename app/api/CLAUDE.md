# app/api/

Next.js Route Handlers — run server-side, not in the browser.

## Existing Routes

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Receives `{ token }`, sets `kafe_token` cookie |
| POST | `/api/auth/logout` | Deletes `kafe_token` cookie |

## Cookie

- Name: `kafe_token`
- Flags: `httpOnly`, `secure`, `sameSite: lax`
- Contains a JWT signed by the backend

## Rules

- Do NOT call `localhost:3333` directly from Route Handlers — use `lib/api/fetcher.ts`
- These routes exist only to manage cookies; business logic belongs in the backend
