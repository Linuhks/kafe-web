'use client'

import { Button } from '@/components/ui/button'
import type { UpdateOrderStatusDtoStatus } from '@/lib/api/generated/api'

type OrderStatus = UpdateOrderStatusDtoStatus

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  RECEIVED: 'IN_PREPARATION',
  IN_PREPARATION: 'READY',
  READY: 'DELIVERED',
}

const LABEL: Partial<Record<OrderStatus, string>> = {
  RECEIVED: 'Iniciar preparo',
  IN_PREPARATION: 'Marcar como pronto',
  READY: 'Entregar',
}

interface StatusButtonProps {
  orderId: string
  currentStatus: OrderStatus
  onUpdate: (id: string, status: OrderStatus) => Promise<void>
  isUpdating: boolean
}

export default function StatusButton({
  orderId,
  currentStatus,
  onUpdate,
  isUpdating,
}: StatusButtonProps) {
  const nextStatus = NEXT_STATUS[currentStatus]
  if (!nextStatus) return null

  return (
    <Button size="sm" isLoading={isUpdating} onClick={() => onUpdate(orderId, nextStatus)}>
      {LABEL[currentStatus]}
    </Button>
  )
}
