export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { categoriesControllerList, productsControllerList } from '@/lib/api/generated/api'
import NavBar from '@/components/layout/NavBar'
import CategoryTabs from '@/components/catalog/CategoryTabs'

export default async function CardapioPage() {
  const t = await getTranslations('menuPage')
  const tf = await getTranslations('footer')
  const [categoriesRes, productsRes] = await Promise.all([
    categoriesControllerList(),
    productsControllerList(),
  ])

  return (
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-4xl font-extrabold text-[var(--kafe-primary)] mb-6">{t('title')}</h2>
        <CategoryTabs
          categories={categoriesRes.data.data ?? []}
          products={productsRes.data.data ?? []}
        />
      </main>
      <footer className="bg-surface-container-highest border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-between">
          <div>
            <p className="text-xl font-extrabold text-[var(--kafe-primary)]">Kafe</p>
            <p className="text-sm text-on-surface-variant">{tf('copyright')}</p>
          </div>
          <nav className="flex gap-6 text-sm text-on-surface-variant">
            <a href="#" className="hover:text-on-surface transition-colors">{tf('links.privacyPolicy')}</a>
            <a href="#" className="hover:text-on-surface transition-colors">{tf('links.termsOfService')}</a>
            <a href="#" className="hover:text-on-surface transition-colors">{tf('links.contact')}</a>
          </nav>
        </div>
      </footer>
    </>
  )
}
