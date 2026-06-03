export const dynamic = 'force-dynamic'

import { categoriesControllerList, productsControllerList } from '@/lib/api/generated/api'
import NavBar from '@/components/layout/NavBar'
import CategoryTabs from '@/components/catalog/CategoryTabs'

export default async function CardapioPage() {
  const [categoriesRes, productsRes] = await Promise.all([
    categoriesControllerList(),
    productsControllerList(),
  ])

  return (
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-4xl font-extrabold text-[var(--kafe-primary)] mb-6">Cardápio</h2>
        <CategoryTabs
          categories={categoriesRes.data.data ?? []}
          products={productsRes.data.data ?? []}
        />
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
