'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUsersControllerUpdate, UpdateUserDtoRole } from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import { useFormDirty } from '@/lib/hooks/useFormDirty'
import type { User } from '@/lib/types'

interface EditUserFormProps {
  user: User
}

export default function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const { setDirty, confirmNavigation } = useFormDirty()

  const [name, setName] = useState(user.name)
  const [role, setRole] = useState<UpdateUserDtoRole>(user.role as UpdateUserDtoRole)
  const [isActive, setIsActive] = useState(user.isActive)

  const { mutate: updateUser, isPending } = useUsersControllerUpdate({
    mutation: {
      onSuccess: () => {
        setDirty(false)
        addToast('Usuário atualizado com sucesso.', 'success')
        router.refresh()
        router.push('/admin/users')
      },
      onError: () => {
        addToast('Erro ao atualizar usuário.', 'error')
      },
    },
  })

  function handleChange() {
    setDirty(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateUser({ id: user.id, data: { name, role, isActive } })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <Input id="email" value={user.email} disabled />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">Nome</label>
        <Input
          id="name"
          value={name}
          onChange={(e) => { setName(e.target.value); handleChange() }}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Papel</label>
        <Select value={role} onValueChange={(v) => { setRole(v as UpdateUserDtoRole); handleChange() }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UpdateUserDtoRole.CLIENT}>Cliente</SelectItem>
            <SelectItem value={UpdateUserDtoRole.BARISTA}>Barista</SelectItem>
            <SelectItem value={UpdateUserDtoRole.ADMIN}>Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium" htmlFor="isActive">Ativo</label>
        <input
          id="isActive"
          type="checkbox"
          checked={isActive}
          onChange={(e) => { setIsActive(e.target.checked); handleChange() }}
          className="h-4 w-4 rounded border border-input accent-primary"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Salvar alterações'}
        </Button>
        <Button type="button" variant="outline" onClick={() => confirmNavigation('/admin/users')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
