import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('kafe_token')?.value

  if (!token) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 })
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

  try {
    const res = await fetch(`${apiUrl}/api/auth/get-session`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(3000),
    })

    if (res.status !== 200) {
      return Response.json({ message: 'Invalid session' }, { status: 401 })
    }

    const data = await res.json()
    const user = data?.user

    if (!user) {
      return Response.json({ message: 'Invalid session' }, { status: 401 })
    }

    return Response.json({ user })
  } catch {
    return Response.json({ message: 'Session check failed' }, { status: 503 })
  }
}
