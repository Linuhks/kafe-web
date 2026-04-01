'use client'

import { Suspense, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange?: (page: number) => void
  className?: string
}

function PaginationInner({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  className,
}: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

  const navigateToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return

      const params = new URLSearchParams(searchParams.toString())
      if (page === 1) {
        params.delete('page')
      } else {
        params.set('page', String(page))
      }
      const qs = params.toString()
      router.push(pathname + (qs ? `?${qs}` : ''))

      onPageChange?.(page)
    },
    [totalPages, searchParams, router, pathname, onPageChange]
  )

  if (totalPages <= 1) return null

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages: (number | '...')[] = [1]
    if (currentPage > 3) pages.push('...')
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const firstItem = (currentPage - 1) * itemsPerPage + 1
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className={cn('flex flex-col items-center gap-3 sm:flex-row sm:justify-between', className)}>
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{firstItem}</span>–
        <span className="font-medium">{lastItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> items
      </p>
      <nav role="navigation" aria-label="Pagination" className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
        >
          Previous
        </Button>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-muted-foreground"
              aria-hidden
            >
              &hellip;
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => navigateToPage(page as number)}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
        >
          Next
        </Button>
      </nav>
    </div>
  )
}

function PaginationSkeleton() {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-9 rounded-md" />
      ))}
    </div>
  )
}

/** Bare Pagination — caller must provide a Suspense boundary. */
export function Pagination(props: PaginationProps) {
  return <PaginationInner {...props} />
}

/** Pre-wrapped in Suspense — safe to use in static/prerendered routes. */
export function PaginationWithSuspense(props: PaginationProps) {
  return (
    <Suspense fallback={<PaginationSkeleton />}>
      <PaginationInner {...props} />
    </Suspense>
  )
}
