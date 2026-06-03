## Context

The existing `AdminOrderQueueClient` renders all active orders in a responsive flat card-grid, with status filter tabs (Todos / Recebidos / Em preparo) in the header. The Stitch redesign replaces this with a three-column Kanban board where columns represent order lifecycle stages. The backend API (`GET /orders/queue`) is already stable and returns orders with a `status` field; no API changes are required.

## Goals / Non-Goals

**Goals:**
- Rewrite `AdminOrderQueueClient` to a Kanban board (three columns: Recebidos, Em Preparo, Concluídos)
- Add category filter tabs ("Todos os Pedidos", "Expressos", "Lanches") replacing the status tabs
- Add a sort dropdown (Mais recentes / Mais antigos / Prioridade) to the board toolbar
- Show a customer-note bubble on cards that have a note
- Add a delete/cancel button on every card alongside the primary action button
- Update footer label to "Operação ativa"

**Non-Goals:**
- No backend changes — the existing queue endpoint is sufficient
- No drag-and-drop between Kanban columns — status advances only via action buttons
- No real-time efficiency metric calculation — footer value remains static placeholder
- No real per-category filtering logic — category tabs are UI scaffolding; API does not currently expose order category

## Decisions

**Column layout via `useMemo` over status grouping**
The three Kanban columns (RECEIVED, IN_PREPARATION, READY) are derived from the same flat list returned by `useOrdersControllerQueue`. A `useMemo` will partition the filtered/sorted list into three arrays by status. This avoids extra fetches and keeps the refetch interval behaviour identical to the current implementation.

**Category filter as client-side no-op for now**
The API does not expose an order category field. The "Expressos" and "Lanches" tabs will be rendered and styled as per the design but will show all orders (same as "Todos") until the backend adds a category field. This unblocks the visual redesign without blocking on an API change.

**Concluídos column shows static empty-state, not completed cards**
The design shows an archived empty-state for the Concluídos column rather than individual completed cards. READY orders are removed from the active view on completion — consistent with the current behaviour of removing them from the queue list. This avoids loading a potentially large historical dataset.

**Delete button calls cancel / status transition**
The design shows a trash icon on every card. Since there is no dedicated DELETE endpoint, the delete button will call the existing update-status mutation with `CANCELLED`. The button is only shown for RECEIVED and IN_PREPARATION orders.

## Risks / Trade-offs

- **Category tabs are placeholder UI** → Acceptable for initial ship; a follow-up API change will add a `category` field and wire the filter.
- **Concluídos column count** → The count badge in the design shows "04" but we have no completed-orders count from the queue endpoint. The badge will be omitted or show "–" until the endpoint includes it. [Risk] Misleading count → Mitigation: hide the count badge on the Concluídos column.
- **Column scroll on wide boards** → The three-column layout is 320–360 px per column. On narrower viewports the board will scroll horizontally. Mitigate with `overflow-x-auto` + `scrollbar-hide` on the board container (matching the Stitch HTML).
