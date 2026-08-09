'use client'

import { FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export default function GenerateReportButton() {
  const t = useTranslations('dashboard')

  return (
    <button
      onClick={() => toast.success(t('reportGenerationStarted'))}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--kafe-primary)] text-[var(--kafe-on-primary)] text-sm font-medium transition-opacity hover:opacity-90"
    >
      <FileText className="w-4 h-4" />
      {t('generateReport')}
    </button>
  )
}
