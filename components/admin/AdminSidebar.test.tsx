import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import AdminSidebar from './AdminSidebar'
import { usePathname } from 'next/navigation'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) =>
    React.createElement('a', { href, className }, children),
}))

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(usePathname).mockReturnValue('/admin/dashboard')
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve(null) }),
  )
})

describe('AdminSidebar', () => {
  it('renders all nav items', async () => {
    render(<AdminSidebar />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Produtos')).toBeInTheDocument()
    expect(screen.getByText('Categorias')).toBeInTheDocument()
    expect(screen.getByText('Usuários')).toBeInTheDocument()
    expect(screen.getByText('Estoque')).toBeInTheDocument()
  })

  it('renders the KAFE wordmark logo', () => {
    render(<AdminSidebar />)
    expect(screen.getByText('KAFE')).toBeInTheDocument()
  })

  it('applies active style to the current route link', () => {
    vi.mocked(usePathname).mockReturnValue('/admin/products')
    render(<AdminSidebar />)
    const productLink = screen.getByText('Produtos').closest('a')
    expect(productLink?.className).toContain('text-[var(--kafe-primary)]')
  })

  it('applies inactive style to non-current route links', () => {
    vi.mocked(usePathname).mockReturnValue('/admin/products')
    render(<AdminSidebar />)
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink?.className).toContain('text-[var(--kafe-on-surface-variant)]')
  })

  it('marks sub-routes as active (startsWith check)', () => {
    vi.mocked(usePathname).mockReturnValue('/admin/products/new')
    render(<AdminSidebar />)
    const productLink = screen.getByText('Produtos').closest('a')
    expect(productLink?.className).toContain('text-[var(--kafe-primary)]')
  })

  it('shows skeleton while session fetch is pending', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))
    const { container } = render(<AdminSidebar />)
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0)
  })

  it('shows user name and role after session fetch resolves', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ user: { name: 'Alex Rivera', role: 'ADMIN' } }),
      }),
    )
    render(<AdminSidebar />)
    await waitFor(() => {
      expect(screen.getByText('Alex Rivera')).toBeInTheDocument()
      expect(screen.getByText('ADMIN')).toBeInTheDocument()
    })
  })
})
