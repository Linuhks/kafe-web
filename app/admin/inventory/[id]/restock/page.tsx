'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useInventoryControllerRestock } from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'

export default function RestockPage() {
  const t = useTranslations('adminInventory.restockPage')
  const tc = useTranslations('common')
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { addToast } = useToast()

  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [quantityError, setQuantityError] = useState('')

  const { mutate: restock, isPending } = useInventoryControllerRestock({
    mutation: {
      onSuccess: () => {
        addToast(t('success'), 'success')
        router.push('/admin/inventory')
      },
      onError: () => {
        addToast(t('error'), 'error')
      },
    },
  })

  function validate(): boolean {
    const qty = parseFloat(quantity)
    if (!quantity.trim() || isNaN(qty) || qty <= 0) {
      setQuantityError(t('quantityInvalid'))
      return false
    }
    setQuantityError('')
    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    restock({
      id: params.id,
      data: {
        quantity,
        note: note.trim() || undefined,
      },
    })
  }

  return (
    <div className="p-6 max-w-md space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button variant="outline" onClick={() => router.push('/admin/inventory')}>
          {tc('cancel')}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="quantity">
            {t('quantity')}
          </label>
          <Input
            id="quantity"
            type="number"
            min="0.01"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={t('quantityPlaceholder')}
          />
          {quantityError && (
            <p className="text-xs text-destructive">{quantityError}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="note">
            {t('note')} <span className="text-muted-foreground font-normal">{tc('optional')}</span>
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('notePlaceholder')}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? tc('saving') : t('submit')}
          </Button>
        </div>
      </form>
    </div>
  )
}
