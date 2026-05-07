'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function useFormDirty() {
  const isDirty = useRef(false)
  const router = useRouter()

  const setDirty = useCallback((dirty: boolean) => {
    isDirty.current = dirty
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty.current) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const confirmNavigation = useCallback(
    (href: string) => {
      if (isDirty.current) {
        const confirmed = window.confirm('Você tem alterações não salvas. Deseja sair mesmo assim?')
        if (!confirmed) return
      }
      router.push(href)
    },
    [router],
  )

  return { setDirty, confirmNavigation }
}
