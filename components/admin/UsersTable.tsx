'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/admin/ConfirmModal'
import { useUsersControllerRemove } from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import type { User } from '@/lib/types'
import type { UserRole } from '@/lib/types'

const roleBadgeVariant: Record<UserRole, 'destructive' | 'secondary' | 'outline'> = {
  ADMIN: 'destructive',
  BARISTA: 'secondary',
  CLIENT: 'outline',
}

const roleLabel: Record<UserRole, string> = {
  ADMIN: 'Admin',
  BARISTA: 'Barista',
  CLIENT: 'Cliente',
}

interface UsersTableProps {
  users: User[]
}

export default function UsersTable({ users }: UsersTableProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  const { mutate: removeUser, isPending } = useUsersControllerRemove({
    mutation: {
      onSuccess: () => {
        addToast('Usuário removido com sucesso.', 'success')
        setDeleteTarget(null)
        router.refresh()
      },
      onError: () => {
        addToast('Erro ao remover usuário.', 'error')
      },
    },
  })

  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Nenhum usuário encontrado.
      </p>
    )
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Papel</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={roleBadgeVariant[user.role as UserRole]}>
                    {roleLabel[user.role as UserRole] ?? user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.isActive ? 'default' : 'outline'}>
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(user)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remover</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Remover usuário"
        message={`Tem certeza que deseja remover "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        loading={isPending}
        onConfirm={() => {
          if (deleteTarget) removeUser({ id: deleteTarget.id })
        }}
      />
    </>
  )
}
