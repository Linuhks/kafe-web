# AI.md

This file documents how AI tooling was used during the development of kafe-web. It exists so that contributors and reviewers can understand the workflow, assess AI-generated artifacts critically, and know where human decisions were made versus where AI output was accepted.

---

## Workflow Overview

Development followed a structured, proposal-first workflow. No feature was implemented without a prior design artifact. AI tools were used at three distinct phases: planning (task decomposition), feature implementation (proposal → design → tasks → code), and general code assistance. Each phase had defined inputs and outputs, and all AI output passed through manual review before being merged.

The general sequence was:

1. **Taskmaster** — decompose the PRD into a tracked task list at project kickoff
2. **OpenSpec** — drive each feature through a proposal/design/tasks cycle before implementation
3. **Claude Code** — implement, debug, and document within the structure established by the above

---

## Taskmaster

**What it does:** Taskmaster takes a Product Requirements Document and generates a structured task list with numbered tasks, subtasks, and dependency ordering. It is a CLI tool that integrates with Claude Code.

**When it was used:** Once, at project kickoff. The PRD described the full frontend system — pages, user roles (admin, client), authentication flow, API integration via Orval, and UI constraints. Taskmaster produced the initial task list that governed the development sequence throughout the project.

**What it produced:** A set of numbered tasks and subtasks covering routing structure, layout components, authentication middleware, API client generation, page-level features (admin dashboard, product management, inventory, order history), and CI/CD setup. Dependencies between tasks were explicit (e.g., Orval type generation before page-level data fetching, session middleware before protected routes).

**Example:** The task covering authentication was broken into subtasks: configure session middleware, implement route protection in Next.js middleware, define role-based redirects for admin and client routes, and wire up the auth context. Each subtask was independently trackable and had a defined prerequisite.

**What was not delegated:** Taskmaster does not make architecture decisions. The choice of Next.js App Router, Tailwind 4, Orval for API type generation, and Better Auth for session management were made before the PRD was written. Taskmaster only decomposed what was already specified.

---

## OpenSpec (opsx)

**What it does:** OpenSpec is a proposal-first development workflow implemented as a set of Claude Code skills. Before implementing a feature, a proposal is generated containing a `proposal.md` (problem statement and solution outline), a `design.md` (technical decisions, data flow, affected files), and a `tasks.md` (ordered implementation steps). Implementation only starts after these artifacts exist and have been reviewed.

**When it was used:** For every non-trivial feature and bug fix throughout development. The cycle was:

- `/opsx:propose` — generate proposal artifacts from a natural-language description
- `/opsx:apply` — implement the tasks defined in `tasks.md`
- `/opsx:archive` — mark the change complete and archive its artifacts

**Example:** When adding the admin inventory management feature, `/opsx:propose` produced a design that identified the three views needed (inventory list, movements, restock), the Orval-generated hooks to consume, the component structure, and the route layout. Reviewing the design before implementation caught that the movements view required a separate API endpoint that had not yet been included in the OpenAPI spec — this was flagged in the design phase and coordinated with the API team before a single component was written.

**What was not delegated:** The contents of `proposal.md` and `design.md` were always read and evaluated before running `/opsx:apply`. If the proposed design introduced unnecessary state management complexity or deviated from the existing page/component conventions, the proposal was revised. AI-generated task lists were treated as a starting point, not a final specification.

---

## Claude Code

**What it does:** Claude Code is an AI coding assistant that runs in the terminal. It was the underlying model used by both Taskmaster and OpenSpec, and was also used directly for code generation, architecture questions, debugging, and documentation.

**When it was used:**
- Writing page and component boilerplate following established patterns (Server Components, Client Components, layouts)
- Debugging TypeScript errors from Orval-generated types
- Generating unit tests for components, contexts, hooks, and API layer utilities
- Writing and updating documentation files

**Model configuration:** Configured to use `claude-sonnet-4-6` as the primary model for all tasks.

**Example:** When implementing the client order history page, Claude Code generated the page component consuming the Orval-generated hook, the loading and empty states, and the order card component. The output required corrections to handle the pagination response shape and was reviewed against the API contract before being accepted.

---

## Human Oversight

The following were never delegated to AI or were always manually reviewed before acceptance:

- **UX and interaction decisions:** Component behavior, loading states, error states, and user-facing copy were reviewed and adjusted manually. AI-generated UI was treated as a first draft.
- **Security decisions:** Session middleware logic, route protection rules, and any code handling auth tokens or role checks was reviewed line by line. AI suggestions in this area were cross-referenced against Better Auth and Next.js middleware documentation.
- **API contract assumptions:** Whenever generated code made assumptions about request/response shapes, these were verified against the actual OpenAPI spec before merging.
- **Dependency additions:** No new `package.json` dependency was added based solely on AI suggestion without reviewing the package's maintenance status and license.
- **Final PR review:** All pull requests received a manual code review regardless of whether the implementation was AI-assisted. AI assistance does not substitute for review.

---

## Lessons Learned

**What worked well:**

- The proposal-first cycle (OpenSpec) eliminated a category of mid-implementation rework. Catching design issues in `design.md` before writing code was consistently cheaper than catching them in review.
- Using Taskmaster at kickoff gave the project a dependency-ordered task list that held up through most of development without needing restructuring.
- Treating AI output as a draft that requires reading — not a solution that requires only running — kept the quality bar consistent.

**What required adjustment:**

- Generated designs occasionally proposed abstractions beyond what the task required. These were trimmed before implementation.
- Test generation produced tests that passed but did not cover meaningful edge cases without explicit prompting about the specific failure modes to test.
- Documentation generated by AI required editing for precision; it was consistently accurate in structure but occasionally vague about behavioral specifics.
