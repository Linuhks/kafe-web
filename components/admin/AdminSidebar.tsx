'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Package, Tag, Users, Archive, Settings, Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produtos', icon: Package },
  { href: '/admin/categories', label: 'Categorias', icon: Tag },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/inventory', label: 'Estoque', icon: Archive },
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser({ name: data.user.name, role: data.user.role })
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--kafe-outline-variant)] bg-[var(--kafe-surface-container-lowest)] flex flex-col h-screen">
      {/* Logo lockup */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--kafe-primary)] flex items-center justify-center rounded-lg shrink-0">
          <Coffee className="w-5 h-5 text-[var(--kafe-on-primary)]" />
        </div>
        <span className="text-[var(--kafe-primary)] font-bold tracking-widest uppercase text-lg">KAFE</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 mt-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-[var(--kafe-secondary-container)]/20 text-[var(--kafe-primary)] font-bold'
                  : 'text-[var(--kafe-on-surface-variant)] hover:bg-[var(--kafe-surface-container-low)] hover:text-[var(--kafe-primary)]',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer: settings + user profile */}
      <div className="p-4 border-t border-[var(--kafe-outline-variant)] space-y-2">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[var(--kafe-on-surface-variant)] hover:text-[var(--kafe-primary)] transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span>Configurações</span>
        </Link>

        {loading ? (
          <div className="px-4 py-3 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        ) : user ? (
          <div className="flex items-center gap-3 px-4 py-3 bg-[var(--kafe-surface-container-low)] rounded-2xl">
            <div className="w-9 h-9 rounded-full bg-[var(--kafe-primary)] text-[var(--kafe-on-primary)] flex items-center justify-center shrink-0 text-sm font-bold">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--kafe-on-surface)] truncate">{user.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--kafe-on-surface-variant)]">
                {user.role}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
