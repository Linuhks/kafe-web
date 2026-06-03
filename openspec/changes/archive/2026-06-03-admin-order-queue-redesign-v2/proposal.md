## Why

The admin order queue Kanban was rebuilt functionally but its visual language still diverges from the Kafe design system tokens — column indicators, card chrome, badge colours, and action button styles all differ from the approved Stitch design. Additionally, staff have no way to see product images when processing an order, requiring them to rely on product names alone.

## What Changes

- Align column indicator dot colours to design-system tokens: `secondary-container` (Recebidos), `primary-fixed` with pulse animation (Em Preparo), `tertiary-fixed` (Concluídos)
- Add card header chrome: a bottom-border divider separates the order-number / customer-name / badge row from the item list
- Fix action button styles: both "Iniciar preparo" and "Concluir" use `bg-primary` filled style (current code only fills the "Concluir" button)
- Fix status badge colours:
  - RECEBIDO → `bg-secondary-container / text-on-secondary-container`
  - EM PREPARO → `bg-primary-fixed / text-on-primary-fixed-variant` with a dot pulse indicator
- Add **Eficiência** stat to the footer and update team-avatar colours to use `primary`, `secondary`, and `tertiary` tokens
- Add order-detail modal: clicking anywhere on a card opens a slide-over / dialog that displays full order info including product thumbnail images — modal is retained per design intent

## Capabilities

### New Capabilities
- `admin-order-detail-modal`: Full-detail overlay opened by clicking an order card, showing customer name, order number, item list with product thumbnail images, customer notes, status badge, and primary action button ("Iniciar preparo" / "Concluir")

### Modified Capabilities
- `admin-order-queue`: Card chrome (header divider), column-indicator token colours, action-button fill style, status-badge colours, footer Eficiência stat, and team-avatar token colours

## Impact

- `components/admin/AdminOrderQueueClient.tsx` — card layout, column headers, button styles, status badges, footer, modal wiring
- `openspec/specs/admin-order-queue/spec.md` — badge colour tokens, button fill behaviour, footer stat requirements
- `openspec/specs/admin-order-detail-modal/spec.md` — new spec (created by this change)
