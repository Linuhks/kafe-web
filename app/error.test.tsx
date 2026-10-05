import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GlobalError from './error'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    ({
      title: 'Algo deu errado',
      description: 'Não foi possível carregar esta página.',
      retry: 'Tentar novamente',
    })[key] ?? key,
}))

describe('app/error.tsx', () => {
  afterEach(() => vi.restoreAllMocks())

  it('shows a friendly message without exposing the error message', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<GlobalError error={new Error('db password leaked')} reset={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Algo deu errado')
    expect(screen.queryByText(/db password leaked/)).not.toBeInTheDocument()
  })

  it('logs the error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('boom')

    render(<GlobalError error={error} reset={vi.fn()} />)

    expect(spy).toHaveBeenCalledWith(error)
  })

  it('calls reset when retry is clicked', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const reset = vi.fn()
    render(<GlobalError error={new Error('boom')} reset={reset} />)

    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(reset).toHaveBeenCalledTimes(1)
  })
})
