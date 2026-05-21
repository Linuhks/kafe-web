import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import InventoryAlertBanner from './InventoryAlertBanner'

describe('InventoryAlertBanner', () => {
  it('renders nothing when no ingredients are provided', () => {
    const { container } = render(<InventoryAlertBanner ingredients={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders ingredient names when ingredients are provided', () => {
    const ingredients = [
      { id: 'i1', name: 'Milk', quantity: 1, unit: 'L', minStock: 2 },
      { id: 'i2', name: 'Sugar', quantity: 0, unit: 'kg', minStock: 1 },
    ] as never
    render(<InventoryAlertBanner ingredients={ingredients} />)
    expect(screen.getByText(/Milk/)).toBeInTheDocument()
    expect(screen.getByText(/Sugar/)).toBeInTheDocument()
  })

  it('shows the low stock label', () => {
    render(
      <InventoryAlertBanner
        ingredients={[{ id: 'i1', name: 'Coffee', quantity: 1, unit: 'kg', minStock: 5 }] as never}
      />,
    )
    expect(screen.getByText(/Estoque baixo/i)).toBeInTheDocument()
  })
})
