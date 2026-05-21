## Requirements

### Requirement: Vitest and React Testing Library installed as dev dependencies
The project SHALL have `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, and `@vitejs/plugin-react` installed as `devDependencies` via pnpm.

#### Scenario: Dependencies present in lockfile
- **WHEN** `pnpm install` is run in a clean environment
- **THEN** all Vitest and React Testing Library packages are available and resolvable

### Requirement: vitest.config.ts at project root
The project SHALL have a `vitest.config.ts` at root defining the jsdom environment, `@/` path alias, setup file reference, and coverage include/exclude patterns.

#### Scenario: Config recognized by runner
- **WHEN** `pnpm test:unit` is executed
- **THEN** Vitest reads `vitest.config.ts` without configuration errors

#### Scenario: Path alias resolves correctly
- **WHEN** a test file uses `import ... from '@/lib/utils'`
- **THEN** Vitest resolves the alias to `<root>/lib/utils.ts` without error

#### Scenario: Generated API excluded from coverage
- **WHEN** coverage is collected
- **THEN** files under `lib/api/generated/` are excluded from the report

### Requirement: vitest.setup.ts registers DOM matchers and global mocks
The project SHALL have a `vitest.setup.ts` that imports `@testing-library/jest-dom` and sets up module mocks for `next/navigation` and `next/image`.

#### Scenario: jest-dom matchers available globally
- **WHEN** a test uses `expect(element).toBeInTheDocument()`
- **THEN** the assertion resolves without importing `@testing-library/jest-dom` in the test file

#### Scenario: next/navigation mocked globally
- **WHEN** a component calls `useRouter()`, `usePathname()`, or `useSearchParams()`
- **THEN** the hooks return mock values without invoking Next.js internals

#### Scenario: next/image mocked globally
- **WHEN** a component renders `<Image />`
- **THEN** a plain `<img>` element is rendered without triggering Next.js image optimisation

### Requirement: test:unit and test:coverage scripts in package.json
`package.json` SHALL expose `test:unit` (runs Vitest once) and `test:coverage` (runs Vitest with coverage collection).

#### Scenario: test:unit passes with empty suite
- **WHEN** `pnpm test:unit` is executed and no test files exist
- **THEN** the command exits with code 0 (or the "no tests found" message without non-zero exit)

#### Scenario: test:coverage produces a coverage report
- **WHEN** `pnpm test:coverage` is executed
- **THEN** a coverage report is written to `coverage/` and printed to the terminal

### Requirement: Coverage threshold enforced in CI
`vitest.config.ts` SHALL declare a coverage threshold of lines ≥80%, functions ≥80%, branches ≥75%; the threshold SHALL only be active once the initial test suite passes.

#### Scenario: Threshold blocks failing coverage
- **WHEN** `pnpm test:coverage` runs and overall line coverage is below 80%
- **THEN** the command exits with a non-zero code

#### Scenario: Threshold passes at or above target
- **WHEN** overall line coverage is ≥80%, functions ≥80%, branches ≥75%
- **THEN** `pnpm test:coverage` exits with code 0
