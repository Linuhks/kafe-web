export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Plus } from 'lucide-react'
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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-kafe-primary">Product Inventory</h1>
          <p className="text-body-md text-kafe-on-surface-variant max-w-xl mt-1">
            Manage your artisanal coffee beans and brewing equipment. Ensure availability reflects current stock.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-kafe-primary text-kafe-on-primary px-6 py-3 rounded-lg text-label-sm hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Add New Product
          <Plus className="h-4 w-4" />
        </Link>
      </header>

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
