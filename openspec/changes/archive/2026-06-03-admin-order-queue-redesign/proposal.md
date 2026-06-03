## Why

The current admin order queue uses a flat card-grid with status filter tabs, making it hard to track order flow at a glance. The new Kanban board layout groups orders by column (Recebidos, Em Preparo, Concluídos), letting staff see the full pipeline state instantly without switching tabs.

## What Changes

- Replace the flat card-grid with a three-column Kanban board layout
- Columns: **Recebidos**, **Em Preparo**, **Concluídos** (each showing count badge)
- Order cards display customer name, item list with quantities, optional customer note, and a primary action button ("Iniciar preparo" / "Concluir") plus a delete button
- Filter toolbar changes from status tabs to category tabs: "Todos os Pedidos", "Expressos", "Lanches"
- Sort dropdown added to toolbar ("Mais recentes", "Mais antigos", "Prioridade")
- Concluídos column shows an archived empty state (not individual completed cards)
- Footer stats updated: Tempo Médio de Preparo, Pedidos na Fila, Eficiência, team avatars with "Operação ativa" label

## Capabilities

### New Capabilities
<!-- none — this is a visual redesign of an existing capability -->

### Modified Capabilities
- `admin-order-queue`: Layout changes from card-grid with status filter tabs to Kanban board with category filter tabs; Concluídos column replaces the READY/READY filter; sort order control added; order cards gain a delete action button; footer stats label changes.

## Impact

- `app/admin/orders/page.tsx` — page layout structure
- `components/admin/AdminOrderQueueClient.tsx` — full component rewrite
- `openspec/specs/admin-order-queue/spec.md` — requirement updates (filter tabs, kanban layout, delete action, sort)
