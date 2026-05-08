export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import UsersTable from '@/components/admin/UsersTable'
import { getUsers } from '@/lib/api/users'

export default async function AdminUsersPage() {
  const { users } = await getUsers()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo usuário
          </Link>
        </Button>
      </div>

      <UsersTable users={users} />
    </div>
  )
}
