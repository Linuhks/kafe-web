import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { UserRole } from '@/lib/types'

async function getSessionFromBackend(token: string): Promise<UserRole | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
    const res = await fetch(`${apiUrl}/api/auth/get-session`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(3000),
    })
    if (res.status !== 200) return null
    const data = await res.json()
    const role = data?.user?.role
    if (typeof role !== 'string') return null
    return role as UserRole
  } catch {
    return null
  }
}

function dashboardForRole(role: UserRole): string {
  if (role === 'ADMIN') return '/admin/dashboard'
  if (role === 'BARISTA') return '/barista/queue'
  return '/orders/me'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('kafe_token')?.value
  const role = token ? await getSessionFromBackend(token) : null

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
    '/((?!api|_next/static|_next/image|favicon\.ico|.*\.png$|.*\.svg$).*)',
  ],
}
