## 1. Token & Column Header Fixes

- [x] 1.1 Update `KanbanColumn` dot colour classes: Recebidos → `bg-secondary-container`, Em Preparo → `bg-primary-fixed animate-pulse`, Concluídos → `bg-tertiary-fixed`
- [x] 1.2 Add bottom-border divider to `OrderCard` header row (order number / customer name / badge section)

## 2. Status Badge & Button Style Fixes

- [x] 2.1 Update `StatusBadge`: RECEIVED → `bg-secondary-container text-on-secondary-container`; IN_PREPARATION → `bg-primary-fixed text-on-primary-fixed-variant` with a small dot pulse indicator
- [x] 2.2 Update advance button in `OrderCard` to always use `bg-primary text-on-primary` filled style (remove the outlined variant for RECEIVED state)
- [x] 2.3 Add `e.stopPropagation()` to both the advance and delete button `onClick` handlers so clicks don't bubble to the card wrapper

## 3. Order Detail Modal

- [x] 3.1 Add `selectedOrder: OrderResponseDto | null` state to `AdminOrderQueueClient` and wire it to a `Dialog` from `components/ui/`
- [x] 3.2 Wrap each `OrderCard` in a clickable container that sets `selectedOrder` on click
- [x] 3.3 Build modal content: order number, customer name, status badge, item list with 40×40 product thumbnail (fallback to `Package` lucide icon when `imageUrl` is null/undefined)
- [x] 3.4 Add primary action button ("Iniciar preparo" / "Concluir") to modal footer; close modal automatically on successful status update
- [x] 3.5 Verify modal closes on Escape and outside-click without side effects

## 4. Footer Updates

- [x] 4.1 Add "Eficiência" stat section to footer (placeholder value `—`)
- [x] 4.2 Update team avatar colours: B1 → `bg-primary text-on-primary`, B2 → `bg-secondary text-on-secondary`, CZ → `bg-tertiary text-on-tertiary`
