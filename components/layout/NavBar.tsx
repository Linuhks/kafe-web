'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, LogOut, User, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import CartSidebar from '@/components/catalog/CartSidebar'

export default function NavBar() {
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const showCart = !user || user.role === 'CLIENT'

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          {/* Logo */}
          <div className="font-extrabold tracking-widest text-[var(--kafe-primary)] text-2xl uppercase">
            KAFE
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.name}</span>
                <Button variant="ghost" size="icon-sm" onClick={logout} title="Sair">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}

            {user?.role === 'CLIENT' && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/orders/me">
                  <ClipboardList className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Meus Pedidos</span>
                </Link>
              </Button>
            )}

            {showCart && (
              <Button
                variant="ghost"
                className="relative flex items-center gap-2 text-[var(--kafe-primary)] hover:opacity-80"
                onClick={() => setIsSidebarOpen(true)}
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
                <span className="hidden sm:inline uppercase tracking-wider font-semibold text-sm">Carrinho</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {showCart && (
        <CartSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
    </>
  )
}
