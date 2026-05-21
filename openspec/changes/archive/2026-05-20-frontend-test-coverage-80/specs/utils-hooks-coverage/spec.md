## ADDED Requirements

### Requirement: cn utility is fully tested
The system SHALL have tests for `lib/utils.ts::cn` covering all class-merging branches.

#### Scenario: Merges conflicting Tailwind classes
- **WHEN** `cn('px-2 px-4')` is called
- **THEN** it SHALL return `'px-4'` (last wins via tailwind-merge)

#### Scenario: Filters falsy values
- **WHEN** `cn('foo', false, null, undefined, 'bar')` is called
- **THEN** it SHALL return `'foo bar'`

#### Scenario: Merges conditional objects
- **WHEN** `cn({ 'text-red-500': true, 'text-blue-500': false })` is called
- **THEN** it SHALL return `'text-red-500'`

### Requirement: usePolling hook is tested
The system SHALL have tests for `hooks/usePolling.ts` using fake timers to verify interval behavior.

#### Scenario: Callback is invoked at the given interval
- **WHEN** `usePolling(callback, 1000)` is rendered and 1000ms advance
- **THEN** the callback SHALL have been called exactly once

#### Scenario: Callback fires repeatedly
- **WHEN** `usePolling(callback, 500)` is rendered and 1500ms advance
- **THEN** the callback SHALL have been called 3 times

#### Scenario: Interval is cleared on unmount
- **WHEN** the component using `usePolling` is unmounted
- **THEN** the callback SHALL not fire after unmount even if the interval would have elapsed

#### Scenario: Updated callback reference is used
- **WHEN** the callback prop changes after mount
- **THEN** the latest callback SHALL be invoked on the next tick (stale closure avoided)

### Requirement: useFormDirty hook is tested
The system SHALL have tests for `lib/hooks/useFormDirty.ts` covering dirty-state tracking and navigation guarding.

#### Scenario: setDirty marks form as dirty
- **WHEN** `setDirty(true)` is called
- **THEN** subsequent `confirmNavigation` SHALL prompt the user before navigating

#### Scenario: confirmNavigation navigates when not dirty
- **WHEN** `setDirty(false)` and `confirmNavigation('/dashboard')` are called
- **THEN** `router.push` SHALL be called with `'/dashboard'` without showing a confirm dialog

#### Scenario: confirmNavigation blocks navigation if user cancels
- **WHEN** form is dirty and `window.confirm` returns `false`
- **THEN** `router.push` SHALL NOT be called

#### Scenario: confirmNavigation navigates if user confirms
- **WHEN** form is dirty and `window.confirm` returns `true`
- **THEN** `router.push` SHALL be called with the target href

#### Scenario: beforeunload event is prevented when dirty
- **WHEN** form is dirty and the `beforeunload` event fires
- **THEN** `event.preventDefault()` SHALL be called

#### Scenario: beforeunload listener is removed on unmount
- **WHEN** the component using `useFormDirty` is unmounted
- **THEN** the `beforeunload` listener SHALL be removed
