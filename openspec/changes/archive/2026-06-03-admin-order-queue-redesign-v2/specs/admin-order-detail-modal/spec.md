## ADDED Requirements

### Requirement: Admin can open an order detail modal
The system SHALL allow an admin to click on an order card body (excluding the action buttons) to open a modal dialog showing the full order details, including product thumbnail images where available.

#### Scenario: Modal opens on card click
- **WHEN** admin clicks anywhere on the order card body (not on the advance or delete buttons)
- **THEN** a modal dialog opens showing the order number, customer name, status badge, full item list with product thumbnail images and quantities, and customer notes if present

#### Scenario: Modal shows product thumbnail
- **WHEN** an item has an image URL
- **THEN** a 40×40 rounded thumbnail image is shown next to the item name inside the modal

#### Scenario: Modal shows placeholder for items without image
- **WHEN** an item has no image URL
- **THEN** a 40×40 muted placeholder icon is shown in place of the thumbnail

#### Scenario: Modal contains the primary action button
- **WHEN** the modal is open for an active order (RECEIVED or IN_PREPARATION)
- **THEN** the modal footer shows the same "Iniciar preparo" or "Concluir" action button as on the card

#### Scenario: Modal closes after action
- **WHEN** admin clicks the action button inside the modal and the status update succeeds
- **THEN** the modal closes automatically

#### Scenario: Modal can be closed without taking action
- **WHEN** admin presses Escape or clicks outside the modal
- **THEN** the modal closes without changing the order status
