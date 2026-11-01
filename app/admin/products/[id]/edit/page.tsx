import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/api/products'
import EditProductForm from './EditProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) notFound()

  return <EditProductForm id={id} />
}
