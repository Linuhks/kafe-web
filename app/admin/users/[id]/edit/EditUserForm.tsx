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
import { useUsersControllerUpdate, UpdateUserDtoRole } from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import { useFormDirty } from '@/lib/hooks/useFormDirty'
import type { User } from '@/lib/types'

interface EditUserFormProps {
  user: User
}

export default function EditUserForm({ user }: EditUserFormProps) {
  const t = useTranslations('adminUsers')
  const tc = useTranslations('common')
  const router = useRouter()
  const { addToast } = useToast()
  const { setDirty, confirmNavigation } = useFormDirty()

  const [name, setName] = useState(user.name)
  const [role, setRole] = useState<UpdateUserDtoRole>(user.role as UpdateUserDtoRole)
  const [isActive, setIsActive] = useState(user.isActive)
  const [nameError, setNameError] = useState<string | null>(null)

  const { mutate: updateUser, isPending } = useUsersControllerUpdate({
    mutation: {
      onSuccess: () => {
        setDirty(false)
        addToast(t('edit.updated'), 'success')
        router.refresh()
        router.push('/admin/users')
      },
      onError: () => {
        addToast(t('edit.updateError'), 'error')
      },
    },
  })

  function handleChange() {
    setDirty(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const editUserSchema = z.object({
      name: z.string().min(1, t('validation.nameRequired')).max(100, t('validation.nameMax')),
    })
    const result = editUserSchema.safeParse({ name })
    if (!result.success) {
      setNameError(result.error.issues[0].message)
      return
    }
    setNameError(null)
    updateUser({ id: user.id, data: { name, role, isActive } })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">{tc('email')}</label>
        <Input id="email" value={user.email} disabled />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">{tc('name')}</label>
        <Input
          id="name"
          value={name}
          onChange={(e) => { setName(e.target.value); handleChange() }}
          required
        />
        {nameError && (
          <p className="text-xs text-destructive">{nameError}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">{t('role')}</label>
        <Select value={role} onValueChange={(v) => { setRole(v as UpdateUserDtoRole); handleChange() }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UpdateUserDtoRole.CLIENT}>{t('roles.CLIENT')}</SelectItem>
            <SelectItem value={UpdateUserDtoRole.BARISTA}>{t('roles.BARISTA')}</SelectItem>
            <SelectItem value={UpdateUserDtoRole.ADMIN}>{t('roles.ADMIN')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium" htmlFor="isActive">{tc('active')}</label>
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
          {isPending ? tc('saving') : tc('saveChanges')}
        </Button>
        <Button type="button" variant="outline" onClick={() => confirmNavigation('/admin/users')}>
          {tc('cancel')}
        </Button>
      </div>
    </form>
  )
}
