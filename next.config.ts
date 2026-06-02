import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development'

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://lh3.googleusercontent.com${isDev ? ' http://localhost:*' : ''}`,
  "font-src 'self'",
  `connect-src 'self' ${apiUrl}`,
  "frame-ancestors 'none'",
].join('; ')

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      ...(isDev ? [{ protocol: 'http' as const, hostname: 'localhost' }] : []),
      { protocol: 'https' as const, hostname: 'lh3.googleusercontent.com' },
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
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ]
  },
};

export default nextConfig;
