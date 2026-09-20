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

## Definition of done (per task)

`pnpm lint` and `pnpm build` passing proves the code compiles — it does not prove the feature works. Before a task is considered complete:

- If the task wires a page/component to a real backend endpoint (an Orval-generated hook, `serverFetch`, or anything under `lib/api/`), run it against a live `kafe-api` — via the `run` skill, a manual click-through, or the relevant Playwright spec under `e2e/` — before marking the task done. Unit tests that mock the generated hooks prove the component's own logic, not that the real integration works. This is exactly the gap that shipped an admin CRUD page whose write-side API wrappers were missing despite the UI looking complete.
- If the task changes `proxy.ts`, a role-gated route, or anything auth-related, verify by actually navigating as each affected role (or a Playwright test doing the same) — not just reading the middleware code.
- If the task is tracked in an external tool (e.g. Task Master) in addition to OpenSpec, update both before marking the task done.

### Security-sensitive tasks

A task touching `proxy.ts`, `AuthContext`, the `kafe_token` cookie, or checkout/order flows needs an explicit answer before it's done — not as a follow-up hardening pass:

- Which roles can reach this route/action, and is that enforced in `proxy.ts` — not only by a component conditionally hiding a button or link?
- Could a signed-out or wrong-role user reach the page or trigger the action by navigating directly to the URL or calling the API client in the browser console?

Run the `security-review` skill on the diff before committing when any of the above applies.

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
