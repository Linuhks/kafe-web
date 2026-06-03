'use client'

import { useState, useMemo } from 'react'
import { Search, Trash2, History, ChevronDown, Package } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  useOrdersControllerQueue,
  useOrdersControllerUpdateStatus,
} from '@/lib/api/generated/api'
import type { OrderResponseDto, UpdateOrderStatusDtoStatus } from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import { cn } from '@/lib/utils'

const ACTIVE_STATUSES = new Set(['RECEIVED', 'IN_PREPARATION'])

type CategoryFilter = 'all' | 'expressos' | 'lanches'
type SortOption = 'newest' | 'oldest' | 'priority'

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: 'RECEBIDO',
  IN_PREPARATION: 'EM PREPARO',
  READY: 'PRONTO',
  DELIVERED: 'ENTREGUE',
  CANCELLED: 'CANCELADO',
}

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Mais recentes',
  oldest: 'Mais antigos',
  priority: 'Prioridade',
}

export default function AdminOrderQueueClient() {
  const { addToast } = useToast()
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [sortOpen, setSortOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderResponseDto | null>(null)

  const queueQuery = useOrdersControllerQueue({
    query: { refetchInterval: 15_000 },
  })

  const updateStatus = useOrdersControllerUpdateStatus({
    mutation: {
      onSuccess: () => {
        queueQuery.refetch()
        addToast('Status atualizado', 'success')
      },
      onError: () => {
        addToast('Erro ao atualizar status', 'error')
      },
    },
  })

  const allOrders: OrderResponseDto[] =
    queueQuery.data?.status === 200
      ? queueQuery.data.data.filter((o) => ACTIVE_STATUSES.has(o.status))
      : []

  const filteredAndSorted = useMemo(() => {
    let list = allOrders.filter((o) => {
      if (!search.trim()) return true
      const name = typeof o.clientName === 'string' ? o.clientName : ''
      return name.toLowerCase().includes(search.trim().toLowerCase())
    })

    if (sort === 'oldest') {
      list = [...list].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
    } else {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    }

    return list
  }, [allOrders, search, sort])

  const receivedOrders = useMemo(
    () => filteredAndSorted.filter((o) => o.status === 'RECEIVED'),
    [filteredAndSorted],
  )
  const inPrepOrders = useMemo(
    () => filteredAndSorted.filter((o) => o.status === 'IN_PREPARATION'),
    [filteredAndSorted],
  )

  async function handleAdvance(order: OrderResponseDto) {
    const next: UpdateOrderStatusDtoStatus =
      order.status === 'RECEIVED' ? 'IN_PREPARATION' : 'READY'
    setUpdatingIds((prev) => new Set(prev).add(order.id))
    try {
      await updateStatus.mutateAsync({ id: order.id, data: { status: next } })
      setSelectedOrder(null)
    } finally {
      setUpdatingIds((prev) => {
        const s = new Set(prev)
        s.delete(order.id)
        return s
      })
    }
  }

  async function handleDelete(order: OrderResponseDto) {
    setUpdatingIds((prev) => new Set(prev).add(order.id))
    try {
      await updateStatus.mutateAsync({ id: order.id, data: { status: 'CANCELLED' } })
    } finally {
      setUpdatingIds((prev) => {
        const s = new Set(prev)
        s.delete(order.id)
        return s
      })
    }
  }

  const categoryTabs: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: 'Todos os Pedidos' },
    { key: 'expressos', label: 'Expressos' },
    { key: 'lanches', label: 'Lanches' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-kafe-primary">Fila de pedidos</h1>
          <p className="text-body-md text-kafe-on-surface-variant mt-1">
            Acompanhe e avance o status dos pedidos em tempo real.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--kafe-on-surface-variant)]" />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--kafe-outline-variant)] bg-[var(--kafe-surface-container-low)] text-sm text-[var(--kafe-on-surface)] placeholder:text-[var(--kafe-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--kafe-primary)]"
          />
        </div>
      </header>

      {/* Toolbar: category tabs + sort */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCategoryFilter(tab.key)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                categoryFilter === tab.key
                  ? 'bg-[var(--kafe-primary)] text-[var(--kafe-on-primary)]'
                  : 'border border-[var(--kafe-outline-variant)] text-[var(--kafe-on-surface-variant)] hover:bg-[var(--kafe-surface-container)] hover:text-[var(--kafe-on-surface)]',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--kafe-outline-variant)] bg-[var(--kafe-surface-container-low)] text-sm text-[var(--kafe-on-surface-variant)] hover:bg-[var(--kafe-surface-container)] hover:text-[var(--kafe-on-surface)] transition-colors"
          >
            {SORT_LABELS[sort]}
            <ChevronDown className="h-4 w-4" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-1 z-10 w-44 rounded-xl border border-[var(--kafe-outline-variant)] bg-[var(--kafe-surface-container-lowest)] shadow-lg overflow-hidden">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setSort(key)
                    setSortOpen(false)
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm transition-colors',
                    sort === key
                      ? 'text-[var(--kafe-primary)] font-medium bg-[var(--kafe-surface-container-low)]'
                      : 'text-[var(--kafe-on-surface-variant)] hover:bg-[var(--kafe-surface-container)] hover:text-[var(--kafe-on-surface)]',
                  )}
                >
                  {SORT_LABELS[key]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kanban board */}
      {queueQuery.isPending ? (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {[0, 1, 2].map((col) => (
            <div key={col} className="flex-none w-80 space-y-3">
              <Skeleton className="h-8 rounded-xl w-40" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          ))}
        </div>
      ) : allOrders.length === 0 && !search.trim() ? (
        <p className="text-center text-[var(--kafe-on-surface-variant)] py-20">
          Nenhum pedido ativo no momento.
        </p>
      ) : (
        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          onWheel={(e) => {
            e.currentTarget.scrollLeft += e.deltaY
          }}
        >
          <KanbanColumn dotClass="bg-[var(--kafe-secondary-container)]" label="RECEBIDOS" count={receivedOrders.length}>
            {receivedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isUpdating={updatingIds.has(order.id)}
                onAdvance={handleAdvance}
                onDelete={handleDelete}
                onOpen={setSelectedOrder}
              />
            ))}
            {receivedOrders.length === 0 && (
              <p className="text-center text-xs text-[var(--kafe-on-surface-variant)] py-8">
                Sem pedidos recebidos
              </p>
            )}
          </KanbanColumn>

          <KanbanColumn dotClass="bg-[var(--kafe-primary-fixed)] animate-pulse" label="EM PREPARO" count={inPrepOrders.length}>
            {inPrepOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isUpdating={updatingIds.has(order.id)}
                onAdvance={handleAdvance}
                onDelete={handleDelete}
                onOpen={setSelectedOrder}
              />
            ))}
            {inPrepOrders.length === 0 && (
              <p className="text-center text-xs text-[var(--kafe-on-surface-variant)] py-8">
                Sem pedidos em preparo
              </p>
            )}
          </KanbanColumn>

          <div className="flex-none w-80 opacity-50">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--kafe-tertiary-fixed)] flex-none" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--kafe-on-surface-variant)]">
                CONCLUÍDOS
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border border-dashed border-[var(--kafe-outline-variant)] bg-[var(--kafe-surface-container-lowest)]">
              <History className="h-8 w-8 text-[var(--kafe-on-surface-variant)]" />
              <p className="text-sm text-[var(--kafe-on-surface-variant)] text-center px-4">
                Pedidos recentes arquivados
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer stats */}
      <footer className="flex items-center justify-between border-t border-[var(--kafe-outline-variant)] pt-4 mt-2 flex-wrap gap-4">
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-[var(--kafe-on-surface-variant)] uppercase tracking-wide">
              Pedidos na Fila
            </p>
            <p className="text-xl font-bold text-[var(--kafe-on-surface)]">{allOrders.length}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--kafe-on-surface-variant)] uppercase tracking-wide">
              Tempo Médio de Preparo
            </p>
            <p className="text-xl font-bold text-[var(--kafe-on-surface)]">—</p>
          </div>
          <div>
            <p className="text-xs text-[var(--kafe-on-surface-variant)] uppercase tracking-wide">
              Eficiência
            </p>
            <p className="text-xl font-bold text-[var(--kafe-on-surface)]">—</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--kafe-on-surface-variant)]">Operação ativa</span>
          <div className="flex -space-x-2">
            <div
              className="w-8 h-8 rounded-full bg-[var(--kafe-primary)] text-[var(--kafe-on-primary)] flex items-center justify-center text-xs font-bold ring-2 ring-[var(--kafe-surface)]"
              title="Barista 1"
            >
              B1
            </div>
            <div
              className="w-8 h-8 rounded-full bg-[var(--kafe-secondary)] text-[var(--kafe-on-secondary)] flex items-center justify-center text-xs font-bold ring-2 ring-[var(--kafe-surface)]"
              title="Barista 2"
            >
              B2
            </div>
            <div
              className="w-8 h-8 rounded-full bg-[var(--kafe-tertiary)] text-[var(--kafe-on-tertiary)] flex items-center justify-center text-xs font-bold ring-2 ring-[var(--kafe-surface)]"
              title="Cozinha"
            >
              CZ
            </div>
          </div>
        </div>
      </footer>

      {/* Order detail modal */}
      <Dialog open={selectedOrder !== null} onOpenChange={(open) => { if (!open) setSelectedOrder(null) }}>
        <DialogContent className="bg-[var(--kafe-surface-container-lowest)] border-[var(--kafe-outline-variant)] sm:max-w-md">
          {selectedOrder && (
            <>
              <DialogHeader className="border-b border-[var(--kafe-outline-variant)] pb-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--kafe-on-surface-variant)]">
                  #{selectedOrder.id.slice(-6).toUpperCase()}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <DialogTitle className="text-[var(--kafe-on-surface)]">
                    {typeof selectedOrder.clientName === 'string' && selectedOrder.clientName
                      ? selectedOrder.clientName
                      : 'Cliente'}
                  </DialogTitle>
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </DialogHeader>

              <div className="space-y-3 py-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--kafe-surface-container)] flex items-center justify-center flex-none">
                      <Package className="h-5 w-5 text-[var(--kafe-on-surface-variant)]" />
                    </div>
                    <span className="flex-1 text-sm text-[var(--kafe-on-surface)]">
                      {item.productName}
                    </span>
                    <span className="text-sm font-bold text-[var(--kafe-primary)]">
                      ×{item.quantity}
                    </span>
                  </div>
                ))}

                {typeof selectedOrder.notes === 'string' && selectedOrder.notes && (
                  <div className="rounded-xl bg-[var(--kafe-surface-container-low)] px-3 py-2 text-sm text-[var(--kafe-on-surface-variant)] italic mt-2">
                    "{selectedOrder.notes}"
                  </div>
                )}
              </div>

              {(selectedOrder.status === 'RECEIVED' || selectedOrder.status === 'IN_PREPARATION') && (
                <DialogFooter className="border-t border-[var(--kafe-outline-variant)] pt-4">
                  <button
                    disabled={updatingIds.has(selectedOrder.id)}
                    onClick={() => handleAdvance(selectedOrder)}
                    className="flex-1 bg-[var(--kafe-primary)] text-[var(--kafe-on-primary)] py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {updatingIds.has(selectedOrder.id)
                      ? 'Atualizando...'
                      : selectedOrder.status === 'RECEIVED'
                        ? 'Iniciar preparo'
                        : 'Concluir'}
                  </button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function KanbanColumn({
  dotClass,
  label,
  count,
  children,
}: {
  dotClass: string
  label: string
  count: number
  children: React.ReactNode
}) {
  return (
    <div className="flex-none w-80">
      <div className="flex items-center gap-2 mb-3">
        <span className={cn('w-2.5 h-2.5 rounded-full flex-none', dotClass)} />
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--kafe-on-surface-variant)]">
          {label}
        </span>
        <span className="ml-auto text-xs font-semibold bg-[var(--kafe-surface-container)] text-[var(--kafe-on-surface-variant)] px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function OrderCard({
  order,
  isUpdating,
  onAdvance,
  onDelete,
  onOpen,
}: {
  order: OrderResponseDto
  isUpdating: boolean
  onAdvance: (order: OrderResponseDto) => void
  onDelete: (order: OrderResponseDto) => void
  onOpen: (order: OrderResponseDto) => void
}) {
  const clientName =
    typeof order.clientName === 'string' && order.clientName ? order.clientName : 'Cliente'
  const orderNum = order.id.slice(-6).toUpperCase()
  const isReceived = order.status === 'RECEIVED'
  const isInPrep = order.status === 'IN_PREPARATION'
  const notes = typeof order.notes === 'string' ? order.notes : null

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(order)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen(order) }}
      className="bg-[var(--kafe-surface-container-lowest)] border border-[var(--kafe-outline-variant)] rounded-2xl flex flex-col gap-0 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-2 px-5 py-4 border-b border-[var(--kafe-outline-variant)]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--kafe-on-surface-variant)]">
            #{orderNum}
          </p>
          <p className="font-bold text-[var(--kafe-on-surface)]">{clientName}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Card body */}
      <div className="px-5 py-4 flex flex-col gap-4">
        <ul className="space-y-1">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="text-sm text-[var(--kafe-on-surface-variant)] flex justify-between"
            >
              <span>{item.productName}</span>
              <span className="text-[var(--kafe-on-surface)] font-medium">×{item.quantity}</span>
            </li>
          ))}
        </ul>

        {notes && (
          <div className="rounded-xl bg-[var(--kafe-surface-container-low)] px-3 py-2 text-sm text-[var(--kafe-on-surface-variant)] italic">
            "{notes}"
          </div>
        )}

        {(isReceived || isInPrep) && (
          <div className="flex gap-2">
            <button
              disabled={isUpdating}
              onClick={(e) => { e.stopPropagation(); onAdvance(order) }}
              className="flex-1 bg-[var(--kafe-primary)] text-[var(--kafe-on-primary)] py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Atualizando...' : isReceived ? 'Iniciar preparo' : 'Concluir'}
            </button>
            <button
              disabled={isUpdating}
              onClick={(e) => { e.stopPropagation(); onDelete(order) }}
              aria-label="Cancelar pedido"
              className="p-2.5 rounded-xl border border-[var(--kafe-outline-variant)] text-[var(--kafe-on-surface-variant)] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isInPrep = status === 'IN_PREPARATION'
  const isReceived = status === 'RECEIVED'

  return (
    <span
      className={cn(
        'text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1',
        isInPrep
          ? 'bg-[var(--kafe-primary-fixed)] text-[var(--kafe-on-primary-fixed-variant)]'
          : isReceived
            ? 'bg-[var(--kafe-secondary-container)] text-[var(--kafe-on-secondary-container)]'
            : 'bg-[var(--kafe-surface-container-low)] text-[var(--kafe-on-surface-variant)]',
      )}
    >
      {isInPrep && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse flex-none" />}
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
