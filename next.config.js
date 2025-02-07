/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://lendify-ai-api.netlify.app/.netlify/functions/api',
  },
  typescript: {
    ignoreBuildErrors: true
  },
  distDir: 'out',
  trailingSlash: true,
  experimental: {
    typedRoutes: true
  }
}

module.exports = nextConfig
