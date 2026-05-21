import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import IngredientFilter from './IngredientFilter'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

describe('IngredientFilter', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    mockPush.mockReset()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as ReturnType<typeof useRouter>)
    vi.mocked(usePathname).mockReturnValue('/admin/inventory/movements')
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as ReturnType<typeof useSearchParams>)
  })

  const ingredients = [
    { id: 'i1', name: 'Milk', quantity: 10, unit: 'L', minStock: 2, createdAt: '', updatedAt: '' },
    { id: 'i2', name: 'Sugar', quantity: 5, unit: 'kg', minStock: 1, createdAt: '', updatedAt: '' },
  ] as never

  it('renders the select trigger', () => {
    render(<IngredientFilter ingredients={ingredients} selectedId="" />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders without crashing for empty ingredients list', () => {
    render(<IngredientFilter ingredients={[]} selectedId="" />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })
})
