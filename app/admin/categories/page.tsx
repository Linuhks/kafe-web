export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CategoriesTable from '@/components/admin/CategoriesTable'
import { getCategories } from '@/lib/api/categories'

export default async function AdminCategoriesPage() {
  const { categories } = await getCategories()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Nova categoria
          </Link>
        </Button>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  )
}
