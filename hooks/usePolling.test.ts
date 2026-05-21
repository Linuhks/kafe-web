import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePolling } from './usePolling'

describe('usePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls the callback after the interval elapses', () => {
    const callback = vi.fn()
    renderHook(() => usePolling(callback, 1000))

    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('calls the callback multiple times for multiple intervals', () => {
    const callback = vi.fn()
    renderHook(() => usePolling(callback, 500))

    vi.advanceTimersByTime(1500)
    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('clears the interval on unmount', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => usePolling(callback, 1000))

    unmount()
    vi.advanceTimersByTime(3000)
    expect(callback).not.toHaveBeenCalled()
  })

  it('uses the latest callback reference (avoids stale closure)', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = renderHook(({ cb }) => usePolling(cb, 1000), {
      initialProps: { cb: first },
    })

    rerender({ cb: second })
    vi.advanceTimersByTime(1000)

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })
})
