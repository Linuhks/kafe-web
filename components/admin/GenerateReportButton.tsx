'use client'

import { FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function GenerateReportButton() {
  return (
    <button
      onClick={() => toast.success('Report generation started')}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--kafe-primary)] text-[var(--kafe-on-primary)] text-sm font-medium transition-opacity hover:opacity-90"
    >
      <FileText className="w-4 h-4" />
      Generate Report
    </button>
  )
}
