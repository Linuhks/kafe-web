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
import { useUsersControllerCreate, CreateUserDtoRole } from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import { useFormDirty } from '@/lib/hooks/useFormDirty'

export default function NewUserPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const { setDirty, confirmNavigation } = useFormDirty()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<CreateUserDtoRole>(CreateUserDtoRole.CLIENT)

  const { mutate: createUser, isPending } = useUsersControllerCreate({
    mutation: {
      onSuccess: () => {
        setDirty(false)
        addToast('Usuário criado com sucesso.', 'success')
        router.push('/admin/users')
      },
      onError: () => {
        addToast('Erro ao criar usuário. Verifique os dados e tente novamente.', 'error')
      },
    },
  })

  function handleChange() {
    setDirty(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createUser({ data: { name, email, password, role } })
  }

  return (
    <div className="p-6 max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Novo usuário</h1>
        <Button variant="outline" onClick={() => confirmNavigation('/admin/users')}>
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); handleChange() }}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">Senha</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); handleChange() }}
            required
            minLength={8}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Papel</label>
          <Select value={role} onValueChange={(v) => { setRole(v as CreateUserDtoRole); handleChange() }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CreateUserDtoRole.CLIENT}>Cliente</SelectItem>
              <SelectItem value={CreateUserDtoRole.BARISTA}>Barista</SelectItem>
              <SelectItem value={CreateUserDtoRole.ADMIN}>Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Criar usuário'}
          </Button>
        </div>
      </form>
    </div>
  )
}
