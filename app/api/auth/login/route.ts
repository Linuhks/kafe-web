import { cookies, headers } from 'next/headers'

const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 10

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = attempts.get(ip)
  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  record.count++
  return record.count > MAX_ATTEMPTS
}

export async function POST(request: Request) {
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return Response.json({ message: 'Too many requests' }, { status: 429 })
  }

  const body = await request.json()
  const token: string | undefined = body.token

  if (!token || typeof token !== 'string') {
    return Response.json({ message: 'token is required' }, { status: 400 })
  }

  const cookieStore = await cookies()
  cookieStore.set('kafe_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  return Response.json({ success: true })
}
