import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'
import { useTranslations } from 'next-intl'

const NAV_LINK_KEYS = ['shop', 'roastery', 'ourStory', 'locations'] as const

export default function TopNavBar() {
  const t = useTranslations('nav.links')

  return (
    <nav className="sticky top-0 z-50 bg-kafe-surface border-b border-kafe-outline-variant">
      <div className="flex items-center justify-between px-margin-page py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-label-sm text-kafe-primary uppercase tracking-widest"
        >
          Kafe
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINK_KEYS.map((key) => (
            <Link
              key={key}
              href="#"
              className="text-label-sm text-kafe-on-surface-variant hover:text-kafe-primary transition-colors"
            >
              {t(key)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-kafe-on-surface-variant hover:text-kafe-primary transition-colors">
            <User size={20} />
          </button>
          <button className="text-kafe-on-surface-variant hover:text-kafe-primary transition-colors">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}
