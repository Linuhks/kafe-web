'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import type { UpdateOrderStatusDtoStatus } from '@/lib/api/generated/api'

type OrderStatus = UpdateOrderStatusDtoStatus

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  RECEIVED: 'IN_PREPARATION',
  IN_PREPARATION: 'READY',
  READY: 'DELIVERED',
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
  const t = useTranslations('statusButton')
  const nextStatus = NEXT_STATUS[currentStatus]
  if (!nextStatus) return null

  return (
    <Button size="sm" isLoading={isUpdating} onClick={() => onUpdate(orderId, nextStatus)}>
      {t(currentStatus as 'RECEIVED' | 'IN_PREPARATION' | 'READY')}
    </Button>
  )
}
