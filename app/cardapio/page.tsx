export const dynamic = 'force-dynamic'

import { categoriesControllerList, productsControllerList } from '@/lib/api/generated/api'
import NavBar from '@/components/layout/NavBar'
import { getTranslations } from 'next-intl/server'
import CategoryTabs from '@/components/catalog/CategoryTabs'

export default async function CardapioPage() {
  const t = await getTranslations('catalog')
  // The API can be unreachable (e.g. cold start on free hosting) — degrade instead of returning a 500
  const [categoriesResult, productsResult] = await Promise.allSettled([
    categoriesControllerList(),
    productsControllerList(),
  ])
  const categoriesOk = categoriesResult.status === 'fulfilled' && categoriesResult.value.status === 200
  const productsOk = productsResult.status === 'fulfilled' && productsResult.value.status === 200
  const loadFailed = !categoriesOk || !productsOk
  const categories = categoriesOk ? (categoriesResult.value.data.data ?? []) : []
  const products = productsOk ? (productsResult.value.data.data ?? []) : []

  return (
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-4xl font-extrabold text-[var(--kafe-primary)] mb-6">Cardápio</h2>
        {loadFailed ? (
          <p className="text-center text-sm text-muted-foreground py-12">
            {t('loadError')}
          </p>
        ) : (
          <CategoryTabs categories={categories} products={products} />
        )}
      </main>
      <footer className="bg-surface-container-highest border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-between">
          <div>
            <p className="text-xl font-extrabold text-[var(--kafe-primary)]">Kafe</p>
            <p className="text-sm text-on-surface-variant">© 2024 Kafe Roastery. Todos os direitos reservados.</p>
          </div>
          <nav className="flex gap-6 text-sm text-on-surface-variant">
            <a href="#" className="hover:text-on-surface transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-on-surface transition-colors">Termos de Serviço</a>
            <a href="#" className="hover:text-on-surface transition-colors">Contato</a>
          </nav>
        </div>
      </footer>
    </>
  )
}
