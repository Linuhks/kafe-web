'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'

interface DateRangePickerProps {
  from: string
  to: string
}

export default function DateRangePicker({ from, to }: DateRangePickerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, value)
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label htmlFor="date-from" className="text-sm text-muted-foreground whitespace-nowrap">
          De
        </label>
        <Input
          id="date-from"
          type="date"
          value={from}
          onChange={(e) => updateParam('from', e.target.value)}
          className="w-40"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="date-to" className="text-sm text-muted-foreground whitespace-nowrap">
          Até
        </label>
        <Input
          id="date-to"
          type="date"
          value={to}
          onChange={(e) => updateParam('to', e.target.value)}
          className="w-40"
        />
      </div>
    </div>
  )
}
