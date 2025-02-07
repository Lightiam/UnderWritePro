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
  trailingSlash: true,
  distDir: 'out',
  experimental: {
    appDir: true,
    serverActions: false
  }
}

module.exports = nextConfig
