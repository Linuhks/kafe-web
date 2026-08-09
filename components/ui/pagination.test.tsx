import { describe, it, expect } from 'vitest'
import { render, screen } from '@/lib/test-utils'
import React from 'react'
import { Pagination } from './pagination'

describe('Pagination', () => {
  it('renders page navigation when there are multiple pages', () => {
    render(
      <Pagination totalItems={50} itemsPerPage={10} currentPage={1} />,
    )
    expect(screen.getByRole('navigation', { name: /paginação/i })).toBeInTheDocument()
  })

  it('renders Previous and Next buttons', () => {
    render(<Pagination totalItems={50} itemsPerPage={10} currentPage={2} />)
    expect(screen.getByRole('button', { name: /anterior/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /próxima/i })).toBeInTheDocument()
  })

  it('disables Previous on first page', () => {
    render(<Pagination totalItems={50} itemsPerPage={10} currentPage={1} />)
    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled()
  })

  it('disables Next on last page', () => {
    render(<Pagination totalItems={50} itemsPerPage={10} currentPage={5} />)
    expect(screen.getByRole('button', { name: /próxima/i })).toBeDisabled()
  })

  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination totalItems={5} itemsPerPage={10} currentPage={1} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
