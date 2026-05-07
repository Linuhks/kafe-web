'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
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

const newUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().email('Email inválido').max(254, 'Email deve ter no máximo 254 caracteres'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').max(128, 'Senha deve ter no máximo 128 caracteres'),
})

type NewUserErrors = Partial<Record<keyof z.infer<typeof newUserSchema>, string>>

export default function NewUserPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const { setDirty, confirmNavigation } = useFormDirty()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<CreateUserDtoRole>(CreateUserDtoRole.CLIENT)
  const [fieldErrors, setFieldErrors] = useState<NewUserErrors>({})

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
    const result = newUserSchema.safeParse({ name, email, password })
    if (!result.success) {
      const errors: NewUserErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof NewUserErrors
        if (!errors[field]) errors[field] = issue.message
      }
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
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
          {fieldErrors.name && (
            <p className="text-xs text-destructive">{fieldErrors.name}</p>
          )}
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
          {fieldErrors.email && (
            <p className="text-xs text-destructive">{fieldErrors.email}</p>
          )}
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
          {fieldErrors.password && (
            <p className="text-xs text-destructive">{fieldErrors.password}</p>
          )}
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
