import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get('kafe_token')

  if (!token) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 })
  }

  cookieStore.delete('kafe_token')
  return Response.json({ success: true })
}
