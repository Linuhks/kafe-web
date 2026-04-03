import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.json()
  const token: string | undefined = body.token

  if (!token || typeof token !== 'string') {
    return Response.json({ message: 'token is required' }, { status: 400 })
  }

  const cookieStore = await cookies()
  cookieStore.set('kafe_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })

  return Response.json({ success: true })
}
