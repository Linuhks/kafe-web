## Requirements

### Requirement: lib/utils.ts is covered by unit tests
`lib/utils.ts` SHALL have unit tests covering class merging, conflict resolution, and falsy value filtering via the `cn()` utility.

#### Scenario: Class merging
- **WHEN** `cn('foo', 'bar')` is called
- **THEN** the result is `'foo bar'`

#### Scenario: Conflict resolution
- **WHEN** conflicting Tailwind classes are passed (e.g., `cn('p-2', 'p-4')`)
- **THEN** the last conflicting class wins (`'p-4'`)

#### Scenario: Falsy filtering
- **WHEN** `cn('foo', undefined, false, null, 'bar')` is called
- **THEN** falsy values are omitted and the result is `'foo bar'`

### Requirement: hooks/usePolling.ts is covered by unit tests
`hooks/usePolling.ts` SHALL have unit tests using `vi.useFakeTimers()` covering interval firing, cleanup on unmount, and absence of stale-closure bugs.

#### Scenario: Callback fires on interval
- **WHEN** `usePolling(cb, 1000)` is rendered and fake timers advance by 1000ms
- **THEN** `cb` is called once

#### Scenario: Multiple intervals fire multiple times
- **WHEN** fake timers advance by 3000ms with a 1000ms interval
- **THEN** `cb` is called three times

#### Scenario: Cleanup on unmount stops polling
- **WHEN** the component using `usePolling` unmounts
- **THEN** advancing fake timers further does not invoke `cb` again

#### Scenario: Stale closure avoided
- **WHEN** the callback reference changes between renders
- **THEN** the latest callback reference is invoked on the next tick

### Requirement: lib/hooks/useFormDirty.ts is covered by unit tests
`lib/hooks/useFormDirty.ts` SHALL have unit tests covering `setDirty`, `confirmNavigation`, and the `beforeunload` listener lifecycle, with `window.confirm` and `next/navigation` router mocked.

#### Scenario: setDirty marks form as dirty
- **WHEN** `setDirty(true)` is called
- **THEN** subsequent navigation attempts trigger `window.confirm`

#### Scenario: confirmNavigation returns true when confirmed
- **WHEN** `window.confirm` is mocked to return `true`
- **THEN** `confirmNavigation()` returns `true` and does not block navigation

#### Scenario: confirmNavigation returns false when cancelled
- **WHEN** `window.confirm` is mocked to return `false`
- **THEN** `confirmNavigation()` returns `false`

#### Scenario: beforeunload listener added when dirty
- **WHEN** the form is marked dirty
- **THEN** a `beforeunload` event listener is registered on `window`

#### Scenario: beforeunload listener removed on cleanup
- **WHEN** the component using `useFormDirty` unmounts
- **THEN** the `beforeunload` listener is removed from `window`
