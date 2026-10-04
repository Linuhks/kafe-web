export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { BarChart3, BookOpen, Plus } from 'lucide-react'
import CategoriesTable from '@/components/admin/CategoriesTable'
import { getCategories } from '@/lib/api/categories'

export default async function AdminCategoriesPage() {
  const { categories } = await getCategories()
  const t = await getTranslations('adminCategories.list')

  return (
    <div className="p-margin-page space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-headline-lg text-kafe-primary">{t('title')}</h1>
          <p className="text-body-md text-kafe-on-surface-variant mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-kafe-primary text-kafe-on-primary px-6 py-3 rounded-xl text-body-md shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
        >
          {t('newCategory')}
          <Plus className="h-4 w-4" />
        </Link>
      </header>

      <CategoriesTable categories={categories} />

      <div className="mt-kafe-stack-lg grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-kafe-primary p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
          <div className="relative z-10">
            <h3 className="text-headline-lg text-white mb-2">{t('tipsTitle')}</h3>
            <p className="text-kafe-on-primary-container text-body-md max-w-md">
              {t('tipsBody')}
            </p>
          </div>
          <div className="absolute -right-12 -bottom-12 opacity-10">
            <BookOpen className="w-[200px] h-[200px] text-white" />
          </div>
        </div>
        <div className="bg-kafe-secondary-container p-8 rounded-3xl flex flex-col justify-center items-center text-center">
          <BarChart3 className="w-12 h-12 text-kafe-primary mb-4" />
          <h4 className="text-headline-md text-kafe-primary mb-1">{t('totalTitle')}</h4>
          <span className="text-[48px] font-bold text-kafe-primary leading-none">{categories.length}</span>
          <p className="text-kafe-on-secondary-container text-label-sm mt-2">{t('totalCaption')}</p>
        </div>
      </div>
    </div>
  )
}
