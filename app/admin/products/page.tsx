import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductsTable from '@/components/admin/ProductsTable'
import { getProducts } from '@/lib/api/products'
import { categoriesControllerList } from '@/lib/api/generated/api'

const ITEMS_PER_PAGE = 20

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10))

  const [productsResult, categoriesRes] = await Promise.all([
    getProducts({ page: currentPage, limit: ITEMS_PER_PAGE }),
    categoriesControllerList(),
  ])

  const categories = categoriesRes.status === 200 ? (categoriesRes.data.data ?? []) : []
  const total = productsResult.pagination?.total ?? productsResult.products.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo produto
          </Link>
        </Button>
      </div>

      <ProductsTable
        products={productsResult.products}
        categories={categories}
        totalItems={total}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
      />
    </div>
  )
}
