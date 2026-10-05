import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import MenuUnavailable from './MenuUnavailable'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    ({ unavailable: 'Cardápio indisponível', retry: 'Tentar novamente' })[key] ?? key,
}))

describe('MenuUnavailable', () => {
  it('shows the unavailable message as an alert', () => {
    render(<MenuUnavailable />)

    expect(screen.getByRole('alert')).toHaveTextContent('Cardápio indisponível')
  })

  it('refreshes the route when the retry button is clicked', async () => {
    const refresh = vi.fn()
    vi.mocked(useRouter).mockReturnValueOnce({ refresh } as unknown as ReturnType<typeof useRouter>)
    render(<MenuUnavailable />)

    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(refresh).toHaveBeenCalledTimes(1)
  })
})
