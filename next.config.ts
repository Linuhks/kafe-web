import type { NextConfig } from "next";

function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL
  if (!url && process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_API_URL is required in production')
  }
  return url ?? 'http://localhost:3000'
}

const isDev = process.env.NODE_ENV === 'development'

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${isDev ? ' http://localhost:*' : ''}`,
  "font-src 'self'",
  `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}`,
  "frame-ancestors 'none'",
].join('; ')

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      ...(isDev ? [{ protocol: 'http' as const, hostname: 'localhost' }] : []),
      // Add production CDN hostname here, e.g.: { protocol: 'https', hostname: 'your-cdn.example.com' }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: cspDirectives },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${getApiUrl()}/api/v1/:path*`,
      },
    ]
  },
};

export default nextConfig;
