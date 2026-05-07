function getBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL ?? 'http://localhost:3333'
  }
  return ''
}

export async function apiFetch<T>(
  url: string,
  {
    method,
    params,
    body,
    headers: extraHeaders,
  }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    params?: Record<string, string>
    body?: BodyInit | null
    headers?: HeadersInit
    responseType?: string
  },
): Promise<T> {
  let targetUrl = `${getBaseUrl()}${url}`

  if (params) {
    targetUrl += '?' + new URLSearchParams(params)
  }

  const res = await fetch(targetUrl, {
    method,
    headers: extraHeaders ?? (body ? { 'Content-Type': 'application/json' } : undefined),
    body,
  })

  const text = [204, 205, 304].includes(res.status) ? null : await res.text()
  const data = text ? JSON.parse(text) : {}
  return { data, status: res.status, headers: res.headers } as T
}
