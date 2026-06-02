import Link from 'next/link'

const FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'Contact', 'Wholesale']

export default function Footer() {
  return (
    <footer className="bg-kafe-surface-container-high border-t border-kafe-outline-variant">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-margin-page py-stack-md max-w-7xl mx-auto gap-4">
        <p className="text-headline-md text-kafe-primary" style={{ fontFamily: 'var(--font-jakarta)' }}>
          Kafe
        </p>

        <nav className="flex flex-wrap items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link}
              href="#"
              className="text-label-sm text-kafe-on-surface-variant hover:text-kafe-primary transition-colors"
            >
              {link}
            </Link>
          ))}
        </nav>

        <p className="text-label-sm text-kafe-on-surface-variant">
          © 2024 Kafe Roastery. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
