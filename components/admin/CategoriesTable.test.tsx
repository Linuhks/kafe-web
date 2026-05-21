import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import CategoriesTable from './CategoriesTable'
import { ToastProvider } from '@/context/ToastContext'
import type { CategoryResponseDto } from '@/lib/api/generated/api'

const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }))

vi.mock('@/lib/api/generated/api', () => ({
  useCategoriesControllerRemove: vi.fn(() => ({ mutate: mockMutate, isPending: false })),
}))

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href }, children),
}))

const mockCategories: CategoryResponseDto[] = [
  { id: 'cat1', name: 'Bebidas', description: 'Drinks', sortOrder: 1, isActive: true, createdAt: '' },
  { id: 'cat2', name: 'Sobremesas', description: null, sortOrder: 2, isActive: false, createdAt: '' },
]

function renderTable(categories = mockCategories) {
  return render(
    <ToastProvider>
      <CategoriesTable categories={categories} />
    </ToastProvider>,
  )
}

describe('CategoriesTable', () => {
  beforeEach(() => mockMutate.mockReset())

  it('renders empty state when no categories', () => {
    renderTable([])
    expect(screen.getByText('Nenhuma categoria encontrada.')).toBeInTheDocument()
  })

  it('renders category names', () => {
    renderTable()
    expect(screen.getByText('Bebidas')).toBeInTheDocument()
    expect(screen.getByText('Sobremesas')).toBeInTheDocument()
  })

  it('renders active badge for active category', () => {
    renderTable()
    expect(screen.getByText('Ativo')).toBeInTheDocument()
  })

  it('renders inactive badge for inactive category', () => {
    renderTable()
    expect(screen.getByText('Inativo')).toBeInTheDocument()
  })

  it('renders description when present', () => {
    renderTable()
    expect(screen.getByText('Drinks')).toBeInTheDocument()
  })

  it('renders em dash for null description', () => {
    renderTable()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('opens confirm modal on delete click', async () => {
    renderTable()
    const deleteButtons = screen.getAllByRole('button', { name: /remover/i })
    await userEvent.click(deleteButtons[0])
    expect(screen.getByText('Remover categoria')).toBeInTheDocument()
  })

  it('calls removeCategory mutation on confirm', async () => {
    renderTable()
    const deleteButtons = screen.getAllByRole('button', { name: /remover/i })
    await userEvent.click(deleteButtons[0])
    const dialog = screen.getByRole('dialog')
    const confirmBtn = within(dialog).getByRole('button', { name: /^remover$/i })
    await userEvent.click(confirmBtn)
    expect(mockMutate).toHaveBeenCalledWith({ id: 'cat1' })
  })
})
