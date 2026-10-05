'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

export default function MenuUnavailable() {
  const t = useTranslations('catalog')
  const router = useRouter()

  return (
    <div role="alert" className="flex flex-col items-center gap-4 py-12 text-center">
      <p className="text-body-lg text-[var(--kafe-primary)]">{t('unavailable')}</p>
      <Button onClick={() => router.refresh()}>{t('retry')}</Button>
    </div>
  )
}
