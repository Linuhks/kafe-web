import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useFormDirty } from './useFormDirty'

describe('useFormDirty', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    mockPush.mockReset()
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as ReturnType<typeof useRouter>)
    vi.spyOn(window, 'confirm').mockReturnValue(false)
  })

  it('navigates immediately when form is not dirty', () => {
    const { result } = renderHook(() => useFormDirty())

    act(() => {
      result.current.setDirty(false)
      result.current.confirmNavigation('/dashboard')
    })

    expect(window.confirm).not.toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('prompts and blocks navigation when dirty and user cancels', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const { result } = renderHook(() => useFormDirty())

    act(() => {
      result.current.setDirty(true)
      result.current.confirmNavigation('/dashboard')
    })

    expect(window.confirm).toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('navigates when dirty and user confirms', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { result } = renderHook(() => useFormDirty())

    act(() => {
      result.current.setDirty(true)
      result.current.confirmNavigation('/settings')
    })

    expect(mockPush).toHaveBeenCalledWith('/settings')
  })

  it('prevents beforeunload when form is dirty', () => {
    const { result } = renderHook(() => useFormDirty())
    act(() => { result.current.setDirty(true) })

    const event = new Event('beforeunload') as BeforeUnloadEvent
    const preventSpy = vi.spyOn(event, 'preventDefault')
    window.dispatchEvent(event)

    expect(preventSpy).toHaveBeenCalled()
  })

  it('does not prevent beforeunload when form is clean', () => {
    renderHook(() => useFormDirty())

    const event = new Event('beforeunload') as BeforeUnloadEvent
    const preventSpy = vi.spyOn(event, 'preventDefault')
    window.dispatchEvent(event)

    expect(preventSpy).not.toHaveBeenCalled()
  })

  it('removes beforeunload listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useFormDirty())

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })
})
