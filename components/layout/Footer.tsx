import Link from 'next/link'
import { useTranslations } from 'next-intl'

const FOOTER_LINK_KEYS = ['privacyPolicy', 'termsOfService', 'contact', 'wholesale'] as const

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-kafe-surface-container-high border-t border-kafe-outline-variant">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-margin-page py-stack-md max-w-7xl mx-auto gap-4">
        <p className="text-headline-md text-kafe-primary" style={{ fontFamily: 'var(--font-jakarta)' }}>
          Kafe
        </p>

        <nav className="flex flex-wrap items-center gap-6">
          {FOOTER_LINK_KEYS.map((key) => (
            <Link
              key={key}
              href="#"
              className="text-label-sm text-kafe-on-surface-variant hover:text-kafe-primary transition-colors"
            >
              {t(`links.${key}`)}
            </Link>
          ))}
        </nav>

        <p className="text-label-sm text-kafe-on-surface-variant">
          {t('copyright')}
        </p>
      </div>
    </footer>
  )
}
