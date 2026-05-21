import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Pagination } from './pagination'

describe('Pagination', () => {
  it('renders page navigation when there are multiple pages', () => {
    render(
      <Pagination totalItems={50} itemsPerPage={10} currentPage={1} />,
    )
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument()
  })

  it('renders Previous and Next buttons', () => {
    render(<Pagination totalItems={50} itemsPerPage={10} currentPage={2} />)
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('disables Previous on first page', () => {
    render(<Pagination totalItems={50} itemsPerPage={10} currentPage={1} />)
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
  })

  it('disables Next on last page', () => {
    render(<Pagination totalItems={50} itemsPerPage={10} currentPage={5} />)
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination totalItems={5} itemsPerPage={10} currentPage={1} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
