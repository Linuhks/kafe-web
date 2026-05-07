import { notFound } from 'next/navigation'
import { getUserById } from '@/lib/api/users'
import EditUserForm from './EditUserForm'

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) notFound()

  return (
    <div className="p-6 max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Editar usuário</h1>
      <EditUserForm user={user} />
    </div>
  )
}
