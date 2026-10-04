'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import StatusButton from './StatusButton'
import type { OrderResponseDto, UpdateOrderStatusDtoStatus } from '@/lib/api/generated/api'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  RECEIVED: 'default',
  IN_PREPARATION: 'secondary',
  READY: 'outline',
  DELIVERED: 'secondary',
  CANCELLED: 'destructive',
}

interface OrderQueueCardProps {
  order: OrderResponseDto
  updatingId: string | null
  onStatusUpdate: (id: string, status: UpdateOrderStatusDtoStatus) => Promise<void>
}

export default function OrderQueueCard({
  order,
  updatingId,
  onStatusUpdate,
}: OrderQueueCardProps) {
  const t = useTranslations('orderQueueCard')
  const tStatus = useTranslations('badge.status')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const isUpdating = updatingId === order.id

  const elapsedMin = Math.floor(
    (Date.now() - new Date(order.createdAt).getTime()) / 60_000
  )

  const clientName =
    typeof order.clientName === 'string' ? order.clientName : t('anonymous')
  const notes = typeof order.notes === 'string' ? order.notes : null

  async function handleConfirmCancel() {
    setConfirmCancel(false)
    await onStatusUpdate(order.id, 'CANCELLED')
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold">{clientName}</p>
            <p className="text-xs text-muted-foreground font-mono">{order.id.slice(0, 8)}…</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={STATUS_VARIANT[order.status]}>
              {tStatus.has(order.status) ? tStatus(order.status) : order.status}
            </Badge>
            <span className="text-xs text-muted-foreground">{t('minutesAgo', { minutes: elapsedMin })}</span>
          </div>
        </div>

        <ul className="space-y-0.5 text-sm">
          {order.items.map(item => (
            <li key={item.id} className="flex justify-between">
              <span>{item.productName}</span>
              <span className="text-muted-foreground">{t('quantityTimes', { quantity: item.quantity })}</span>
            </li>
          ))}
        </ul>

        {notes && (
          <p className="text-sm text-muted-foreground border-t pt-2">
            <span className="font-medium">{t('notes')}</span> {notes}
          </p>
        )}

        <div className="flex gap-2 border-t pt-3">
          <StatusButton
            orderId={order.id}
            currentStatus={order.status as UpdateOrderStatusDtoStatus}
            onUpdate={onStatusUpdate}
            isUpdating={isUpdating}
          />
          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
            <Button
              size="sm"
              variant="destructive"
              disabled={isUpdating}
              onClick={() => setConfirmCancel(true)}
            >
              {t('cancel')}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('cancelTitle')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t.rich('cancelMessage', {
              clientName,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCancel(false)}>
              {t('back')}
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              {t('confirmCancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
