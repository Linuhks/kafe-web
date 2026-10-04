'use client'

import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  loading?: boolean
}

export default function ConfirmModal({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel,
  onConfirm,
  loading = false,
}: ConfirmModalProps) {
  const t = useTranslations('confirmModal')
  const tc = useTranslations('common')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title ?? t('defaultTitle')}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {tc('cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? t('wait') : (confirmLabel ?? t('defaultConfirm'))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
