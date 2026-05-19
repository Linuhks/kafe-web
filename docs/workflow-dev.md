# Development Workflow

Every feature or bug fix is broken down into tasks with numbered subtasks. The same quality gate applies to every subtask, across every task.

---

## Task structure

```
Task 1 — Feature name
  1.1  First subtask
  1.2  Second subtask
  1.3  Third subtask

Task 2 — Another feature
  2.1  First subtask
  2.2  Second subtask
```

---

## Per-subtask gate

After completing any subtask (1.1, 1.2, 2.1, 2.2 — regardless of which task), run in order:

```bash
pnpm lint    # ESLint — catches rule violations
pnpm build   # Next.js production build — catches TypeScript errors and build failures
```

**Both must pass before committing.** If either fails, fix the issue and re-run from `pnpm lint`.

Once both pass, commit:

```bash
git add <changed files>
git commit -m "feat(scope): description of what the subtask did"
```

Then move on to the next subtask and repeat.

---

## Example flow

```
Implement 1.1
  ↓
pnpm lint  → pass
pnpm build → pass
  ↓
git commit -m "feat(barista): add OrderQueueCard component"
  ↓
Implement 1.2
  ↓
pnpm lint  → pass
pnpm build → pass
  ↓
git commit -m "feat(barista): add queue page with polling"
  ↓
Implement 1.3  →  gate  →  commit
  ↓
Implement 2.1
  ↓
pnpm lint  → pass
pnpm build → pass
  ↓
git commit -m "feat(admin): add UsersTable component"
  ↓
Implement 2.2  →  gate  →  commit
```

One commit per subtask. Each commit must leave the codebase in a working state.

---

## Code standards

### No `any`

Never use `any`. Always declare explicit types or use the generated types from `lib/types/index.ts`.

```typescript
// ❌
const data: any = await serverFetch(...)

// ✅
const data = await serverFetch<{ data: User[]; status: number; headers: Headers }>(...)

// ✅ for unknown error shapes
catch (err: unknown) {
  const message = err instanceof Error ? err.message : 'Unknown error'
}
```

### Always use `cn()` for class merging

```typescript
// ❌
<div className={`base ${condition ? 'active' : ''} ${className}`} />

// ✅
<div className={cn('base', condition && 'active', className)} />
```

### Check `components/ui/` before creating primitives

`button`, `input`, `dialog`, `select`, `badge`, `skeleton`, `pagination`, and `sonner` already exist. Do not recreate them.

### Regenerate API client after backend changes

If the backend adds or changes endpoints, regenerate the React Query hooks:

```bash
pnpm generate:api   # backend must be running at localhost:3333
```

Never edit `lib/api/generated/api.ts` manually — it is git-ignored and will be overwritten.
