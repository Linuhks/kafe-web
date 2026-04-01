'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast.success('Order is ready for pickup!')}>
        Success Toast
      </Button>
      <Button
        variant="destructive"
        onClick={() => toast.error('Failed to place order')}
      >
        Error Toast
      </Button>
      <Button variant="secondary" onClick={() => toast('New order received')}>
        Info Toast
      </Button>
    </div>
  )
}
