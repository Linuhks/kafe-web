import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import DateRangePicker from './DateRangePicker'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

describe('DateRangePicker', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    mockPush.mockReset()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as ReturnType<typeof useRouter>)
    vi.mocked(usePathname).mockReturnValue('/admin/dashboard')
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as ReturnType<typeof useSearchParams>)
  })

  it('renders De and Até labels', () => {
    render(<DateRangePicker from="2024-01-01" to="2024-01-31" />)
    expect(screen.getByText('De')).toBeInTheDocument()
    expect(screen.getByText('Até')).toBeInTheDocument()
  })

  it('renders inputs with correct values', () => {
    render(<DateRangePicker from="2024-01-01" to="2024-01-31" />)
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2024-01-31')).toBeInTheDocument()
  })

  it('calls router.push with updated from param on change', () => {
    render(<DateRangePicker from="2024-01-01" to="2024-01-31" />)
    fireEvent.change(screen.getByLabelText('De'), { target: { value: '2024-02-01' } })
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('from=2024-02-01'))
  })

  it('calls router.push with updated to param on change', () => {
    render(<DateRangePicker from="2024-01-01" to="2024-01-31" />)
    fireEvent.change(screen.getByLabelText('Até'), { target: { value: '2024-02-28' } })
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('to=2024-02-28'))
  })
})
