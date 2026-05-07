import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { UserRole } from '@/lib/types'

async function verifyAndDecodeJwt(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [header, payload, signature] = parts

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )

    const sigBytes = Uint8Array.from(
      atob(signature.replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0),
    )

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(`${header}.${payload}`),
    )

    if (!isValid) return null

    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

async function getRoleFromToken(token: string | undefined): Promise<UserRole | null> {
  if (!token) return null
  const secret = process.env.JWT_SECRET
  if (!secret) return null
  const payload = await verifyAndDecodeJwt(token, secret)
  if (!payload || typeof payload.role !== 'string') return null
  return payload.role as UserRole
}

function dashboardForRole(role: UserRole): string {
  if (role === 'ADMIN') return '/admin/dashboard'
  if (role === 'BARISTA') return '/barista/queue'
  return '/orders/me'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('kafe_token')?.value
  const role = await getRoleFromToken(token)

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
