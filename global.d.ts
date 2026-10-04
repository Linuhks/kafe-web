import type messages from './messages/pt-BR.json'

// Types useTranslations()/getTranslations() against the pt-BR catalog, so
// namespaces and keys autocomplete and typos fail `tsc`. pt-BR is the source
// of truth; messages/catalog.test.ts keeps en-US in sync with it.
declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages
  }
}
