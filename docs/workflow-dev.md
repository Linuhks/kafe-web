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

See [Code Guide](code-guide.md) for conventions on typing, class merging, UI primitives, and API client generation.

---

## After completing all tasks

When all tasks in a change are done, update documentation before archiving:

| Changed | Update |
|---------|--------|
| New route or page | `docs/modules.md` route map, `app/CLAUDE.md` route table |
| New component | `docs/modules.md` component index |
| New hook | `docs/modules.md` hooks table |
| Auth or middleware logic | `docs/architecture.md` |
| New convention or pattern | `docs/code-guide.md` |
| Folder structure changed | Relevant `CLAUDE.md` in that folder |

If nothing changed structurally, no documentation update is needed.
