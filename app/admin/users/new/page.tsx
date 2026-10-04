'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
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

type NewUserErrors = Partial<Record<'name' | 'email' | 'password', string>>

export default function NewUserPage() {
  const t = useTranslations('adminUsers')
  const tc = useTranslations('common')
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
        addToast(t('new.created'), 'success')
        router.push('/admin/users')
      },
      onError: () => {
        addToast(t('new.createError'), 'error')
      },
    },
  })

  function handleChange() {
    setDirty(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newUserSchema = z.object({
      name: z.string().min(1, t('validation.nameRequired')).max(100, t('validation.nameMax')),
      email: z.string().email(t('validation.emailInvalid')).max(254, t('validation.emailMax')),
      password: z
        .string()
        .min(8, t('validation.passwordMin'))
        .max(128, t('validation.passwordMax')),
    })
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
        <h1 className="text-2xl font-bold">{t('new.title')}</h1>
        <Button variant="outline" onClick={() => confirmNavigation('/admin/users')}>
          {tc('cancel')}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="name">{tc('name')}</label>
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
          <label className="text-sm font-medium" htmlFor="email">{tc('email')}</label>
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
          <label className="text-sm font-medium" htmlFor="password">{t('password')}</label>
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
          <label className="text-sm font-medium">{t('role')}</label>
          <Select value={role} onValueChange={(v) => { setRole(v as CreateUserDtoRole); handleChange() }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CreateUserDtoRole.CLIENT}>{t('roles.CLIENT')}</SelectItem>
              <SelectItem value={CreateUserDtoRole.BARISTA}>{t('roles.BARISTA')}</SelectItem>
              <SelectItem value={CreateUserDtoRole.ADMIN}>{t('roles.ADMIN')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? tc('saving') : t('new.submit')}
          </Button>
        </div>
      </form>
    </div>
  )
}
