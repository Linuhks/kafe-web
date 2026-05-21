import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import AdminSidebar from './AdminSidebar'
import { usePathname } from 'next/navigation'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) =>
    React.createElement('a', { href, className }, children),
}))

describe('AdminSidebar', () => {
  it('renders all nav items', () => {
    vi.mocked(usePathname).mockReturnValue('/admin/dashboard')
    render(<AdminSidebar />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Produtos')).toBeInTheDocument()
    expect(screen.getByText('Categorias')).toBeInTheDocument()
    expect(screen.getByText('Usuários')).toBeInTheDocument()
    expect(screen.getByText('Estoque')).toBeInTheDocument()
  })

  it('applies active style to the current route link', () => {
    vi.mocked(usePathname).mockReturnValue('/admin/products')
    render(<AdminSidebar />)
    const productLink = screen.getByText('Produtos').closest('a')
    expect(productLink?.className).toContain('bg-primary')
  })

  it('applies inactive style to non-current route links', () => {
    vi.mocked(usePathname).mockReturnValue('/admin/products')
    render(<AdminSidebar />)
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink?.className).toContain('text-muted-foreground')
  })

  it('marks sub-routes as active (startsWith check)', () => {
    vi.mocked(usePathname).mockReturnValue('/admin/products/new')
    render(<AdminSidebar />)
    const productLink = screen.getByText('Produtos').closest('a')
    expect(productLink?.className).toContain('bg-primary')
  })
})
