import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('renders a placeholder element', () => {
    render(<Skeleton data-testid="skel" className="h-4 w-full" />)
    expect(screen.getByTestId('skel')).toBeInTheDocument()
  })

  it('applies animate-pulse class', () => {
    render(<Skeleton data-testid="skel" />)
    expect(screen.getByTestId('skel').className).toContain('animate-pulse')
  })
})
