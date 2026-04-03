import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { UserRole } from '@/lib/types'

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = Buffer.from(base64, 'base64').toString('utf-8')
    return JSON.parse(json)
  } catch {
    return null
  }
}

function getRoleFromToken(token: string | undefined): UserRole | null {
  if (!token) return null
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload.role !== 'string') return null
  return payload.role as UserRole
}

function dashboardForRole(role: UserRole): string {
  if (role === 'ADMIN') return '/admin/dashboard'
  if (role === 'BARISTA') return '/barista/queue'
  return '/orders/me'
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('kafe_token')?.value
  const role = getRoleFromToken(token)

  // Redirect authenticated users away from /login
  if (pathname === '/login') {
    if (role) {
      return NextResponse.redirect(new URL(dashboardForRole(role), request.url))
    }
    return NextResponse.next()
  }

  // /admin/* requires ADMIN
  if (pathname.startsWith('/admin/')) {
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // /barista/* requires BARISTA or ADMIN
  if (pathname.startsWith('/barista/')) {
    if (role !== 'BARISTA' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // /orders/me requires any authenticated user
  if (pathname.startsWith('/orders/me')) {
    if (!role) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.svg$).*)',
  ],
}
