## ADDED Requirements

### Requirement: Static structure renders
The test suite SHALL verify that the key structural elements of the login page are present in the DOM on initial render.

#### Scenario: Heading and subtext render
- **WHEN** the login page is rendered
- **THEN** "Welcome back" heading and "Sign in to continue your coffee journey." text are in the document

#### Scenario: Form fields render
- **WHEN** the login page is rendered
- **THEN** email input, password input, and "Sign In" button are present

#### Scenario: Navigation links render
- **WHEN** the login page is rendered
- **THEN** "Forgot Password?" and "Create an account" links are present

#### Scenario: Social buttons render
- **WHEN** the login page is rendered
- **THEN** "Google" and "Apple" buttons are present

#### Scenario: Divider text renders
- **WHEN** the login page is rendered
- **THEN** "or join the club" text is present

#### Scenario: Footer renders
- **WHEN** the login page is rendered
- **THEN** "© 2024 Kafe Roastery. All rights reserved." text is present

#### Scenario: Hero image has accessible alt text
- **WHEN** the login page is rendered
- **THEN** an image with alt "The Ritual of Brewing" is present

### Requirement: Password visibility toggle
The test suite SHALL verify that the password visibility toggle button switches the password input between `password` and `text` types.

#### Scenario: Initial state is password type
- **WHEN** the login page is rendered
- **THEN** the password input has type "password" and the toggle button has aria-label "Show password"

#### Scenario: Toggle reveals password
- **WHEN** user clicks the "Show password" toggle button
- **THEN** the password input type changes to "text" and aria-label becomes "Hide password"

#### Scenario: Second toggle hides password
- **WHEN** user clicks the toggle button twice
- **THEN** the password input type returns to "password"

### Requirement: Form validation errors
The test suite SHALL verify that Zod validation messages appear when the form is submitted with invalid data.

#### Scenario: Invalid email shows error
- **WHEN** user submits the form with a non-email value in the email field
- **THEN** "Invalid email" error message appears in the document

#### Scenario: Short password shows error
- **WHEN** user submits the form with a password shorter than 8 characters
- **THEN** "Password must be at least 8 characters" error message appears

#### Scenario: Empty form shows errors
- **WHEN** user clicks the submit button without filling any field
- **THEN** validation error messages appear for both fields

### Requirement: Successful login and role-based redirect
The test suite SHALL verify that a successful login calls the auth API, sets the user, and redirects to the correct dashboard based on role.

#### Scenario: ADMIN redirected to /admin/dashboard
- **WHEN** login API returns 200 with role ADMIN
- **THEN** router.push is called with "/admin/dashboard"

#### Scenario: BARISTA redirected to /barista/queue
- **WHEN** login API returns 200 with role BARISTA
- **THEN** router.push is called with "/barista/queue"

#### Scenario: CLIENT redirected to /orders/me
- **WHEN** login API returns 200 with role CLIENT
- **THEN** router.push is called with "/orders/me"

#### Scenario: Session cookie endpoint called on success
- **WHEN** login API returns 200
- **THEN** fetch is called with "/api/auth/login" via POST with the token in the body

#### Scenario: setUser called with returned user
- **WHEN** login API returns 200
- **THEN** setUser is called with the user object from the response

### Requirement: Login error handling
The test suite SHALL verify that appropriate error toasts are shown when login fails.

#### Scenario: Non-200 response shows invalid credentials toast
- **WHEN** login API returns a non-200 status
- **THEN** addToast is called with "Invalid email or password" and type "error"

#### Scenario: Network error shows generic toast
- **WHEN** the mutateAsync call throws an exception
- **THEN** addToast is called with "Login failed. Please try again." and type "error"

### Requirement: Loading/pending state
The test suite SHALL verify the button's behavior while a login request is in flight.

#### Scenario: Button shows pending text
- **WHEN** isPending is true
- **THEN** the submit button text is "Signing in…" and the button is disabled

#### Scenario: Button is enabled when not pending
- **WHEN** isPending is false
- **THEN** the submit button is not disabled and shows "Sign In"

### Requirement: Social buttons do not submit the form
The test suite SHALL verify that the Google and Apple buttons cannot accidentally submit the login form.

#### Scenario: Google button has type="button"
- **WHEN** the login page is rendered
- **THEN** the Google button has type "button"

#### Scenario: Apple button has type="button"
- **WHEN** the login page is rendered
- **THEN** the Apple button has type "button"
