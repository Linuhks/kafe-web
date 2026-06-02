import Link from 'next/link'

const NAV_LINKS = ['Shop', 'Roastery', 'Our Story', 'Locations']

export default function TopNavBar() {
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
          {NAV_LINKS.map((link) => (
            <Link
              key={link}
              href="#"
              className="text-label-sm text-kafe-on-surface-variant hover:text-kafe-primary transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-kafe-on-surface-variant hover:text-kafe-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </button>
          <button className="text-kafe-on-surface-variant hover:text-kafe-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
