'use client'

import { useState } from 'react'
import { ShoppingCart, Coffee, LogOut, User } from 'lucide-react'
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
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Coffee className="h-5 w-5" />
            Kafe
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

            {showCart && (
              <Button
                variant="outline"
                size="sm"
                className="relative"
                onClick={() => setIsSidebarOpen(true)}
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
                <span className="ml-1 hidden sm:inline">Carrinho</span>
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
