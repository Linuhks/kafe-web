import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '@/messages/pt-BR.json'

function Providers({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="pt-BR" messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Providers, ...options })
}

export * from '@testing-library/react'
export { renderWithProviders as render }
