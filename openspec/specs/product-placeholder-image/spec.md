## Requirements

### Requirement: Product placeholder image exists at static path
The system SHALL provide a static SVG file at `public/images/product-placeholder.svg` that `next/image` can serve as a fallback when a product has no `imageUrl`.

#### Scenario: Placeholder is accessible via browser
- **WHEN** a browser requests `/images/product-placeholder.svg`
- **THEN** the server responds with a valid SVG document and `200 OK`

#### Scenario: Placeholder renders in ProductCard
- **WHEN** a `ProductCard` receives a product with a missing or empty `imageUrl`
- **THEN** the card displays the placeholder SVG without broken image indicators or layout shift
