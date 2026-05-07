'use client'

import { Skeleton } from '@/components/ui/skeleton'
import InventoryAlertBanner from '@/components/barista/InventoryAlertBanner'
import OrderQueueCard from '@/components/barista/OrderQueueCard'
import {
  useOrdersControllerQueue,
  useOrdersControllerUpdateStatus,
  useInventoryControllerAlerts,
} from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import type { UpdateOrderStatusDtoStatus } from '@/lib/api/generated/api'

const ACTIVE_STATUSES = new Set(['RECEIVED', 'IN_PREPARATION'])

export default function BaristaQueuePage() {
  const { addToast } = useToast()

  const queueQuery = useOrdersControllerQueue({
    query: { refetchInterval: 15_000 },
  })

  const alertsQuery = useInventoryControllerAlerts()

  const updateStatus = useOrdersControllerUpdateStatus({
    mutation: {
      onSuccess: () => {
        queueQuery.refetch()
        addToast('Status atualizado', 'success')
      },
      onError: (err) => {
        addToast('Erro ao atualizar status', 'error')
      },
    },
  })

  const orders =
    queueQuery.data?.status === 200
      ? queueQuery.data.data.filter(o => ACTIVE_STATUSES.has(o.status))
      : []

  const alerts =
    alertsQuery.data?.status === 200 ? alertsQuery.data.data : []

  const loading = queueQuery.isPending || alertsQuery.isPending

  async function handleStatusUpdate(id: string, status: UpdateOrderStatusDtoStatus): Promise<void> {
    await updateStatus.mutateAsync({ id, data: { status } })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold">Fila de pedidos</h1>

        <InventoryAlertBanner ingredients={alerts} />

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            Nenhum pedido ativo no momento.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {orders.map(order => (
              <OrderQueueCard
                key={order.id}
                order={order}
                updatingId={updateStatus.isPending ? updateStatus.variables?.id ?? null : null}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
