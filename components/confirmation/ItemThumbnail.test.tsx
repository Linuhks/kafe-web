import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import ItemThumbnail from './ItemThumbnail'

describe('ItemThumbnail', () => {
  it('renders the given src and alt text', () => {
    render(<ItemThumbnail src="/images/espresso.jpg" alt="Espresso" />)
    const img = screen.getByRole('img', { name: 'Espresso' })
    expect(img).toHaveAttribute('src', '/images/espresso.jpg')
  })

  it('falls back to the placeholder image when no src is given', () => {
    render(<ItemThumbnail alt="Produto" />)
    expect(screen.getByRole('img', { name: 'Produto' })).toHaveAttribute(
      'src',
      '/images/product-placeholder.svg',
    )
  })

  it('swaps to the placeholder image on load error', () => {
    render(<ItemThumbnail src="/images/broken.jpg" alt="Produto" />)
    const img = screen.getByRole('img', { name: 'Produto' })
    fireEvent.error(img)
    expect(img).toHaveAttribute('src', '/images/product-placeholder.svg')
  })
})
