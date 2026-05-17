import { cookies } from 'next/headers'
import { apiFetch } from './fetcher'

export async function serverFetch<T>(
  url: string,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    params?: Record<string, string>
    body?: BodyInit | null
    headers?: Record<string, string>
    responseType?: string
  },
): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get('kafe_token')?.value
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}

  return apiFetch<T>(url, {
    ...options,
    headers: { ...authHeader, ...(options.headers ?? {}) },
  })
}
