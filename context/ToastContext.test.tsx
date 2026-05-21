import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import React from 'react'
import { ToastProvider, useToast } from './ToastContext'

const { mockToast, mockToastSuccess, mockToastError, mockToastWarning } = vi.hoisted(() => ({
  mockToast: vi.fn(),
  mockToastSuccess: vi.fn(),
  mockToastError: vi.fn(),
  mockToastWarning: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: Object.assign(mockToast, {
    success: mockToastSuccess,
    error: mockToastError,
    warning: mockToastWarning,
  }),
  Toaster: () => null,
}))

function ToastTrigger({ type }: { type?: Parameters<ReturnType<typeof useToast>['addToast']>[1] }) {
  const { addToast } = useToast()
  return (
    <button onClick={() => addToast('Test message', type)}>trigger</button>
  )
}

function renderToast(type?: Parameters<ReturnType<typeof useToast>['addToast']>[1]) {
  const { getByText } = render(
    <ToastProvider>
      <ToastTrigger type={type} />
    </ToastProvider>,
  )
  return getByText('trigger')
}

describe('ToastContext', () => {
  beforeEach(() => {
    mockToast.mockReset()
    mockToastSuccess.mockReset()
    mockToastError.mockReset()
    mockToastWarning.mockReset()
  })

  it('calls toast.success for success type', async () => {
    const btn = renderToast('success')
    await act(async () => { btn.click() })
    expect(mockToastSuccess).toHaveBeenCalledWith('Test message')
  })

  it('calls toast.error for error type', async () => {
    const btn = renderToast('error')
    await act(async () => { btn.click() })
    expect(mockToastError).toHaveBeenCalledWith('Test message')
  })

  it('calls toast.warning for warning type', async () => {
    const btn = renderToast('warning')
    await act(async () => { btn.click() })
    expect(mockToastWarning).toHaveBeenCalledWith('Test message')
  })

  it('calls default toast() for info type', async () => {
    const btn = renderToast('info')
    await act(async () => { btn.click() })
    expect(mockToast).toHaveBeenCalledWith('Test message')
  })

  it('calls default toast() when type is omitted', async () => {
    const btn = renderToast()
    await act(async () => { btn.click() })
    expect(mockToast).toHaveBeenCalledWith('Test message')
  })

  it('throws when useToast is called outside ToastProvider', () => {
    const consoleError = console.error
    console.error = () => {}
    expect(() => render(<ToastTrigger />)).toThrow('useToast must be used within ToastProvider')
    console.error = consoleError
  })
})
