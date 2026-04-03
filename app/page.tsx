import { categoriesControllerList, productsControllerList } from '@/lib/api/generated/api'
import NavBar from '@/components/layout/NavBar'
import CategoryTabs from '@/components/catalog/CategoryTabs'
import type { Category, Product } from '@/lib/types'

export default async function Home() {
  const [categoriesRes, productsRes] = await Promise.all([
    categoriesControllerList(),
    productsControllerList(),
  ])

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Cardápio</h1>
        <CategoryTabs
          categories={(categoriesRes.data.data ?? []) as Category[]}
          products={(productsRes.data.data ?? []) as Product[]}
        />
      </main>
    </>
  )
}
