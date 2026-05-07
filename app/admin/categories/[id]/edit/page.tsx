import { notFound } from 'next/navigation'
import { getCategoryById } from '@/lib/api/categories'
import EditCategoryForm from './EditCategoryForm'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategoryById(id)

  if (!category) notFound()

  return (
    <div className="p-6 max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Editar categoria</h1>
      <EditCategoryForm category={category} />
    </div>
  )
}
