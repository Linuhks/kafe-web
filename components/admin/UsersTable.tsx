'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
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

interface UsersTableProps {
  users: User[]
}

export default function UsersTable({ users }: UsersTableProps) {
  const t = useTranslations('adminUsers')
  const tc = useTranslations('common')
  const router = useRouter()
  const { addToast } = useToast()
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  const { mutate: removeUser, isPending } = useUsersControllerRemove({
    mutation: {
      onSuccess: () => {
        addToast(t('table.removed'), 'success')
        setDeleteTarget(null)
        router.refresh()
      },
      onError: () => {
        addToast(t('table.removeError'), 'error')
      },
    },
  })

  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        {t('table.empty')}
      </p>
    )
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{tc('name')}</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{tc('email')}</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('role')}</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{tc('status')}</th>
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
                    {t.has(`roles.${user.role}`) ? t(`roles.${user.role}`) : user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.isActive ? 'default' : 'outline'}>
                    {user.isActive ? tc('active') : tc('inactive')}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">{tc('edit')}</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(user)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">{tc('remove')}</span>
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
        title={t('table.removeTitle')}
        message={t('table.removeMessage', { name: deleteTarget?.name ?? '' })}
        confirmLabel={tc('remove')}
        loading={isPending}
        onConfirm={() => {
          if (deleteTarget) removeUser({ id: deleteTarget.id })
        }}
      />
    </>
  )
}
