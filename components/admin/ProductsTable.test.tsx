import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ProductsTable from './ProductsTable'
import { ToastProvider } from '@/context/ToastContext'
import type { ProductResponseDto, CategoryResponseDto } from '@/lib/api/generated/api'

const { mockToggleAvail, mockRemove } = vi.hoisted(() => ({
  mockToggleAvail: vi.fn(),
  mockRemove: vi.fn(),
}))

vi.mock('@/lib/api/generated/api', () => ({
  useProductsControllerToggleAvail: vi.fn(() => ({ mutate: mockToggleAvail })),
  useProductsControllerRemove: vi.fn(() => ({ mutate: mockRemove, isPending: false })),
}))

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href }, children),
}))

const mockCategories: CategoryResponseDto[] = [
  { id: 'c1', name: 'Bebidas', description: null, sortOrder: 1, isActive: true, createdAt: '' },
]

const mockProducts: ProductResponseDto[] = [
  { id: 'p1', name: 'Espresso', price: '5.50', categoryId: 'c1', isAvailable: true, description: null, imageUrl: null, createdAt: '', updatedAt: '' },
  { id: 'p2', name: 'Latte', price: '7.00', categoryId: 'c1', isAvailable: false, description: null, imageUrl: null, createdAt: '', updatedAt: '' },
]

function renderTable(products = mockProducts) {
  return render(
    <ToastProvider>
      <ProductsTable
        products={products}
        categories={mockCategories}
        totalItems={products.length}
        itemsPerPage={10}
        currentPage={1}
      />
    </ToastProvider>,
  )
}

describe('ProductsTable', () => {
  beforeEach(() => {
    mockToggleAvail.mockReset()
    mockRemove.mockReset()
  })

  it('renders product names', () => {
    renderTable()
    expect(screen.getByText('Espresso')).toBeInTheDocument()
    expect(screen.getByText('Latte')).toBeInTheDocument()
  })

  it('renders resolved category name', () => {
    renderTable()
    expect(screen.getAllByText('Bebidas').length).toBeGreaterThan(0)
  })

  it('renders formatted BRL price', () => {
    renderTable()
    expect(screen.getByText(/5,50/)).toBeInTheDocument()
  })

  it('renders availability toggle switches', () => {
    renderTable()
    const toggles = screen.getAllByRole('switch')
    expect(toggles).toHaveLength(2)
  })

  it('renders empty message when no products', () => {
    renderTable([])
    expect(screen.getByText('Nenhum produto encontrado.')).toBeInTheDocument()
  })

  it('calls toggleAvail on switch click', async () => {
    renderTable()
    const [firstToggle] = screen.getAllByRole('switch')
    await userEvent.click(firstToggle)
    expect(mockToggleAvail).toHaveBeenCalledWith({ id: 'p1' })
  })

  it('opens confirm modal on delete click', async () => {
    renderTable()
    const deleteButtons = screen.getAllByRole('button', { name: /remover/i })
    await userEvent.click(deleteButtons[0])
    expect(screen.getByText('Remover produto')).toBeInTheDocument()
  })
})
