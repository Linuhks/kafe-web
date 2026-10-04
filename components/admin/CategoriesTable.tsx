'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, Pencil, Tag, Trash2 } from 'lucide-react'
import ConfirmModal from '@/components/admin/ConfirmModal'
import { useCategoriesControllerRemove } from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import type { CategoryResponseDto } from '@/lib/api/generated/api'

interface CategoriesTableProps {
  categories: CategoryResponseDto[]
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const t = useTranslations('adminCategories.table')
  const tc = useTranslations('common')
  const router = useRouter()
  const { addToast } = useToast()
  const [deleteTarget, setDeleteTarget] = useState<CategoryResponseDto | null>(null)

  const { mutate: removeCategory, isPending } = useCategoriesControllerRemove({
    mutation: {
      onSuccess: () => {
        addToast(t('removed'), 'success')
        setDeleteTarget(null)
        router.refresh()
      },
      onError: () => {
        addToast(t('removeError'), 'error')
      },
    },
  })

  if (categories.length === 0) {
    return (
      <div className="py-16 text-center text-kafe-on-surface-variant">
        {t('empty')}
      </div>
    )
  }

  return (
    <>
      <div className="bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-kafe-surface-container-low border-b border-kafe-outline-variant">
                <th className="px-6 py-5 text-label-sm text-kafe-on-surface-variant uppercase tracking-wider">{tc('name')}</th>
                <th className="px-6 py-5 text-label-sm text-kafe-on-surface-variant uppercase tracking-wider">{tc('description')}</th>
                <th className="px-6 py-5 text-label-sm text-kafe-on-surface-variant uppercase tracking-wider text-center">{t('order')}</th>
                <th className="px-6 py-5 text-label-sm text-kafe-on-surface-variant uppercase tracking-wider">{tc('status')}</th>
                <th className="px-6 py-5 text-label-sm text-kafe-on-surface-variant uppercase tracking-wider text-right">{tc('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kafe-outline-variant">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-kafe-surface-container-low/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-kafe-secondary-container flex items-center justify-center text-kafe-primary shrink-0">
                        <Tag className="h-5 w-5" />
                      </div>
                      <span className="text-[18px] font-semibold text-kafe-primary">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-body-md text-kafe-on-surface-variant">
                    {typeof cat.description === 'string' ? cat.description : tc('emptyValue')}
                  </td>
                  <td className="px-6 py-5 text-body-md text-kafe-on-surface-variant text-center">{cat.sortOrder}</td>
                  <td className="px-6 py-5">
                    {cat.isActive ? (
                      <span className="inline-block px-3 py-1 bg-status-ready/15 text-status-ready rounded-full text-[12px] uppercase font-semibold">
                        {tc('active')}
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-kafe-surface-container text-kafe-on-surface-variant rounded-full text-[12px] uppercase font-semibold">
                        {tc('inactive')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="p-2 text-kafe-on-surface-variant hover:text-kafe-primary hover:bg-kafe-surface-container-high transition-all rounded-lg"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">{tc('edit')}</span>
                      </Link>
                      <button
                        className="p-2 text-kafe-on-surface-variant hover:text-kafe-error hover:bg-kafe-error-container/50 transition-all rounded-lg"
                        onClick={() => setDeleteTarget(cat)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{tc('remove')}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-kafe-surface-container-low flex justify-between items-center border-t border-kafe-outline-variant">
          <span className="text-body-md text-kafe-on-surface-variant">{t('showing', { count: categories.length })}</span>
          <div className="flex gap-2">
            <button
              className="p-2 rounded-lg border border-kafe-outline-variant hover:bg-kafe-surface-container-high disabled:opacity-30"
              disabled
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded-lg border border-kafe-outline-variant hover:bg-kafe-surface-container-high disabled:opacity-30"
              disabled
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title={t('removeTitle')}
        message={t('removeMessage', { name: deleteTarget?.name ?? '' })}
        confirmLabel={tc('remove')}
        onConfirm={() => deleteTarget && removeCategory({ id: deleteTarget.id })}
        loading={isPending}
      />
    </>
  )
}
