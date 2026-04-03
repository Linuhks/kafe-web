'use client'

import { useState } from 'react'
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

const orderSchema = z.object({
  clientName: z.string().optional(),
  notes: z.string().optional(),
})

type OrderFields = z.infer<typeof orderSchema>

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function OrderForm({ isOpen, onClose }: OrderFormProps) {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const { addToast } = useToast()
  const [confirmedOrder, setConfirmedOrder] = useState<OrderResponseDto | null>(null)

  const { register, handleSubmit, reset } = useForm<OrderFields>({
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
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Erro ao criar pedido'
        addToast(message, 'error')
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
      <DialogContent>
        {confirmedOrder ? (
          <>
            <DialogHeader>
              <DialogTitle>Pedido confirmado!</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <p className="text-sm text-muted-foreground">
                Seu pedido foi recebido com sucesso.
              </p>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded">
                ID: {confirmedOrder.id}
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Fechar</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Finalizar pedido</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="clientName" className="text-sm font-medium">
                  Seu nome
                </label>
                <Input
                  id="clientName"
                  placeholder="Nome para o pedido"
                  {...register('clientName')}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="notes" className="text-sm font-medium">
                  Observações
                </label>
                <textarea
                  id="notes"
                  className="w-full min-h-[80px] rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Alguma observação? (opcional)"
                  {...register('notes')}
                />
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
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
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isPending} disabled={items.length === 0}>
                  Confirmar pedido
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
