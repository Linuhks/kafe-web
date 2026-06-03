## 1. Kanban Board Layout

- [x] 1.1 Replace flat card-grid in `AdminOrderQueueClient` with a three-column flex container (Recebidos, Em Preparo, Concluídos)
- [x] 1.2 Add column header with coloured dot, uppercase label, and count badge per column
- [x] 1.3 Add `overflow-x-auto` + `scrollbar-hide` to board container and wire horizontal scroll on mouse-wheel
- [x] 1.4 Render the Concluídos column as a static archived empty-state (history icon + "Pedidos recentes arquivados") with reduced opacity
- [x] 1.5 Partition orders into three arrays by status (RECEIVED → col 1, IN_PREPARATION → col 2) via `useMemo`

## 2. Order Card Redesign

- [x] 2.1 Update card header to show order number (small caps), customer name, and status pill
- [x] 2.2 Render item list with product name and quantity per row
- [x] 2.3 Add customer-note bubble (shaded `bg-surface-container-low`) below item list when note is present
- [x] 2.4 Replace single action button row with: primary action button ("Iniciar preparo" / "Concluir") + delete icon button
- [x] 2.5 Wire delete button to update status to CANCELLED via existing `useOrdersControllerUpdateStatus` mutation
- [x] 2.6 Disable action button and show loading state while status mutation is in-flight for that card

## 3. Board Toolbar

- [x] 3.1 Replace status filter tabs (Todos / Recebidos / Em preparo) with category tabs (Todos os Pedidos / Expressos / Lanches)
- [x] 3.2 Style active tab as `bg-primary text-on-primary rounded-full` and inactive tabs as outlined pills
- [x] 3.3 Add sort dropdown ("Mais recentes" / "Mais antigos" / "Prioridade") to the right side of the toolbar
- [x] 3.4 Apply sort state to filtered order list before partitioning into columns

## 4. Search

- [x] 4.1 Retain customer-name search input in the top bar (already implemented); confirm it filters across all columns

## 5. Footer

- [x] 5.1 Update team avatars label from "Equipe ativa na operação" to "Operação ativa"
- [x] 5.2 Confirm Tempo Médio de Preparo and Pedidos na Fila stats still render correctly after list refactor

## 6. Spec Archive

- [x] 6.1 Run `openspec archive --change admin-order-queue-redesign` after implementation is complete
