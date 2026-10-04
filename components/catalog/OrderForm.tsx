'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useOrdersControllerCreate } from '@/lib/api/generated/api'
import type { OrderResponseDto } from '@/lib/api/generated/api'

type OrderFields = { clientName?: string; notes?: string }

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function OrderForm({ isOpen, onClose }: OrderFormProps) {
  const t = useTranslations('orderForm')
  const tc = useTranslations('common')
  const orderSchema = z.object({
    clientName: z.string().max(100, t('nameMax')).optional(),
    notes: z.string().max(500, t('notesMax')).optional(),
  })
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const { addToast } = useToast()
  const [confirmedOrder, setConfirmedOrder] = useState<OrderResponseDto | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderFields>({
    resolver: zodResolver(orderSchema),
    defaultValues: { clientName: user?.name ?? '', notes: '' },
  })

  const { mutate, isPending } = useOrdersControllerCreate({
    mutation: {
      onSuccess: (response) => {
        if (response.status === 201) {
          setConfirmedOrder(response.data)
          clearCart()
        }
      },
      onError: () => {
        addToast(t('createError'), 'error')
      },
    },
  })

  function onSubmit(values: OrderFields) {
    mutate({
      data: {
        clientName: values.clientName?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      },
    })
  }

  function handleClose() {
    setConfirmedOrder(null)
    reset({ clientName: user?.name ?? '', notes: '' })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent showCloseButton={!confirmedOrder}>
        {confirmedOrder ? (
          <>
            <DialogHeader>
              <DialogTitle>{t('confirmedTitle')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <p className="text-sm text-muted-foreground">
                {t('confirmedMessage')}
              </p>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded">
                {t('orderId', { id: confirmedOrder.id })}
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>{tc('close')}</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t('title')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="clientName" className="text-sm font-medium">
                  {t('yourName')}
                </label>
                <Input
                  id="clientName"
                  placeholder={t('namePlaceholder')}
                  {...register('clientName')}
                />
                {errors.clientName && (
                  <p className="text-xs text-destructive">{errors.clientName.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label htmlFor="notes" className="text-sm font-medium">
                  {t('notes')}
                </label>
                <textarea
                  id="notes"
                  className="w-full min-h-[80px] rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder={t('notesPlaceholder')}
                  {...register('notes')}
                />
                {errors.notes && (
                  <p className="text-xs text-destructive">{errors.notes.message}</p>
                )}
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span>{tc('total')}</span>
                  <span>
                    {total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  {tc('cancel')}
                </Button>
                <Button type="submit" isLoading={isPending} disabled={items.length === 0}>
                  {t('confirm')}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
