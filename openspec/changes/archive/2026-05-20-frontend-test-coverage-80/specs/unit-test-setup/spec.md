## ADDED Requirements

### Requirement: Vitest is installed and configured
The system SHALL have Vitest, jsdom, React Testing Library, and coverage tooling installed as devDependencies, with a `vitest.config.ts` at the project root that resolves the `@/` path alias from `tsconfig.json`.

#### Scenario: Config file exists with correct settings
- **WHEN** `vitest.config.ts` is present at the project root
- **THEN** it SHALL configure the test environment as `jsdom`, set up file to `vitest.setup.ts`, include `src` patterns for coverage, and resolve `@/` to `./`

#### Scenario: Path alias resolution
- **WHEN** a test file imports `@/lib/utils`
- **THEN** Vitest SHALL resolve it correctly without a module-not-found error

### Requirement: Test scripts are available in package.json
The system SHALL expose `test:unit` and `test:coverage` npm scripts.

#### Scenario: Unit test script runs
- **WHEN** `pnpm test:unit` is executed
- **THEN** Vitest SHALL run all `*.test.ts(x)` files in watch=false mode and exit with code 0 if all tests pass

#### Scenario: Coverage script runs with threshold
- **WHEN** `pnpm test:coverage` is executed
- **THEN** Vitest SHALL collect V8 coverage and exit with a non-zero code if line coverage falls below 80%

### Requirement: jest-dom matchers are globally available
The system SHALL configure a `vitest.setup.ts` that extends `expect` with `@testing-library/jest-dom` matchers so that assertions like `toBeInTheDocument()`, `toHaveTextContent()`, and `toBeDisabled()` are available in all test files without explicit imports.

#### Scenario: DOM matchers work in tests
- **WHEN** a test uses `expect(element).toBeInTheDocument()`
- **THEN** the assertion SHALL pass without importing `@testing-library/jest-dom` in that file

### Requirement: Next.js module mocks are configured globally
The system SHALL mock `next/navigation` and `next/image` in the Vitest setup so tests do not fail due to missing Next.js internals in jsdom.

#### Scenario: next/navigation mock provides router functions
- **WHEN** a component calls `useRouter()`, `usePathname()`, or `useSearchParams()`
- **THEN** the mocks SHALL return stub functions that can be spied on in tests

#### Scenario: next/image renders as img
- **WHEN** a component renders `<Image>` from `next/image`
- **THEN** the mock SHALL render a plain `<img>` element with the same `src` and `alt` props
