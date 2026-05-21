import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { QueryProvider } from './QueryProvider'

describe('QueryProvider', () => {
  it('renders children', () => {
    render(
      <QueryProvider>
        <span data-testid="child">Hello</span>
      </QueryProvider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
