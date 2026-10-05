'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errors')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-24 text-center"
    >
      <h1 className="text-headline-lg text-[var(--kafe-primary)]">{t('title')}</h1>
      <p className="text-body-md text-on-surface-variant">{t('description')}</p>
      <Button onClick={reset}>{t('retry')}</Button>
    </main>
  )
}
