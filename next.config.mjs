/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        // This will redirect /old-route/123 to /new-route/123
        source: '/old-route/:code',
        destination: '/new-route/:code',
        permanent: true, // Use 301 for permanent move (good for SEO)
      },
    ]
  },
}

export default nextConfig
