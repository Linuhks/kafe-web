### Requirement: script-src does not include unsafe-eval
The Content-Security-Policy header's `script-src` directive SHALL NOT include `'unsafe-eval'`. Only `'self'` and `'unsafe-inline'` are permitted until nonce-based CSP is adopted.

#### Scenario: Production build serves pages without unsafe-eval in script-src
- **WHEN** a browser requests any page from the production build
- **THEN** the `Content-Security-Policy` response header contains `script-src 'self' 'unsafe-inline'` with no `'unsafe-eval'` token

#### Scenario: App hydrates correctly without unsafe-eval
- **WHEN** a user loads any page in a browser that enforces the CSP
- **THEN** no CSP violation is reported for `'unsafe-eval'` and the page renders fully interactive

### Requirement: font-src allows Google Fonts static assets
The Content-Security-Policy header's `font-src` directive SHALL include `https://fonts.gstatic.com` so that the Material Symbols font files loaded by `layout.tsx` are not blocked.

#### Scenario: Material Symbols icon font loads without CSP violation
- **WHEN** a user opens any page that renders icons from the Material Symbols font
- **THEN** the font file is fetched from `fonts.gstatic.com` without a CSP violation and icons are visible

### Requirement: style-src allows Google Fonts stylesheet
The Content-Security-Policy header's `style-src` directive SHALL include `https://fonts.googleapis.com` so that the Google Fonts CSS loaded via `<link>` in `layout.tsx` is not blocked.

#### Scenario: Google Fonts CSS loads without CSP violation
- **WHEN** a browser processes the `<link rel="stylesheet">` tag pointing to `fonts.googleapis.com`
- **THEN** the stylesheet is fetched without a CSP violation
