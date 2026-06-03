## Context

`AdminOrderQueueClient` is a single client component that fetches the order queue via React Query (`useOrdersControllerQueue`, polling every 15s), splits orders into RECEIVED / IN_PREPARATION buckets, and renders a three-column Kanban board. The column chrome, badge colours, and button styles were built to pass functional requirements but deviate from Kafe design system tokens. A new modal capability must be layered on top without restructuring the existing polling / mutation logic.

Product images are accessible via `item.imageUrl` (nullable string) on each `OrderItemResponseDto`; no new API endpoints are needed.

## Goals / Non-Goals

**Goals:**
- Align all visual tokens (dot colours, badge colours, button fill) to the Stitch design reference
- Add card-header chrome (border-b divider between header and body)
- Add order-detail modal opened by clicking the card body (not the action buttons)
- Show product thumbnail images inside the modal
- Add Eficiência stat placeholder and fix team-avatar token colours in the footer

**Non-Goals:**
- Real-time efficiency calculation (placeholder value only — no new API)
- Barista / role-specific views
- Drag-and-drop Kanban reordering

## Decisions

### Modal: shadcn Dialog vs custom overlay
Use the existing `Dialog` primitive from `components/ui/` (Radix-based). It matches the rest of the admin UI and avoids adding a new dependency. The modal is opened by a click on the card body area; the action and delete buttons remain as direct controls on the card and do NOT open the modal.

### State management for modal
Add a single `selectedOrder: OrderResponseDto | null` state to `AdminOrderQueueClient`. Setting it to a non-null value opens the dialog; the dialog's `onOpenChange` closes it. No separate context needed — scope is local to this page.

### Product images
`item.imageUrl` may be null (products added before image upload was supported). Render a rounded thumbnail (40×40) when present; fall back to a `Package` lucide icon placeholder in a muted container of the same size.

### Button fill logic correction
Current code: RECEIVED → outlined, IN_PREPARATION → filled (`bg-primary`).  
Design: both states → `bg-primary` filled. Update `OrderCard` to always use the filled style for the advance button.

### Token mapping
| Element | Old class | New class |
|---|---|---|
| Recebidos dot | `bg-amber-400` | `bg-secondary-container` |
| Em Preparo dot | `bg-blue-400` | `bg-primary-fixed animate-pulse` |
| Concluídos dot | `bg-green-400` | `bg-tertiary-fixed` |
| RECEBIDO badge | `bg-surface-container-highest text-on-surface` | `bg-secondary-container text-on-secondary-container` |
| EM PREPARO badge | `bg-secondary-container text-on-secondary-container` | `bg-primary-fixed text-on-primary-fixed-variant` |
| B1 avatar | `bg-secondary-container` | `bg-primary text-on-primary` |
| B2 avatar | `bg-secondary-container` | `bg-secondary text-on-secondary` |
| CZ avatar | `bg-secondary-container` | `bg-tertiary text-on-tertiary` |

## Risks / Trade-offs

- [Risk] `item.imageUrl` field may not exist on the generated DTO → Mitigation: access with optional chaining (`item.imageUrl?.`) and fall back to placeholder icon; no type assertion.
- [Risk] Modal opens on card click but card also has nested clickable buttons → Mitigation: call `e.stopPropagation()` on the advance and delete button `onClick` handlers so clicks on those buttons do not bubble to the card wrapper.
- [Risk] Eficiência is a placeholder (hardcoded `—`) → Mitigation: document as a future data point; no regression risk.
