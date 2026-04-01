import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { PaginationWithSuspense } from '@/components/ui/pagination'
import type { OrderStatus } from '@/lib/types'
import { ToastDemo } from './_components/toast-demo'

const ALL_STATUSES: OrderStatus[] = [
  'RECEIVED',
  'IN_PREPARATION',
  'READY',
  'DELIVERED',
  'CANCELLED',
]

export default function TestComponentsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-12 p-8">
      <h1 className="text-3xl font-bold text-brand-coffee">
        Component Library
      </h1>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Order Status Badges</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((status) => (
            <Badge key={status} status={status} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Default Badge</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Input */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Input</h2>
        <div className="max-w-sm space-y-2">
          <Input placeholder="Search orders..." />
          <Input placeholder="Disabled input" disabled />
        </div>
      </section>

      {/* Select */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Select</h2>
        <Select>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {ALL_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Dialog */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Dialog</h2>
        <p className="text-sm text-muted-foreground">
          Closes on ESC or backdrop click (Radix default).
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Press ESC or click outside to close this dialog.
            </p>
            <Button className="mt-4 w-full">Confirm</Button>
          </DialogContent>
        </Dialog>
      </section>

      {/* Skeleton */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Skeleton</h2>
        <div className="space-y-2">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-10 w-80 rounded-md" />
        </div>
      </section>

      {/* Toast */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Toast (Sonner)</h2>
        <ToastDemo />
        <Toaster />
      </section>

      {/* Pagination */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pagination</h2>
        <PaginationWithSuspense
          totalItems={100}
          itemsPerPage={10}
          currentPage={1}
        />
      </section>
    </main>
  )
}
