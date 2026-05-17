import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      // Add production CDN hostname here, e.g.: { protocol: 'https', hostname: 'your-cdn.example.com' }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'}/api/v1/:path*`,
      },
    ]
  },
};

export default nextConfig;
