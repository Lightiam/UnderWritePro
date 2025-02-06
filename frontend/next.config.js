/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['localhost', 'lendify-ai-api.netlify.app'],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://lendify-ai-api.netlify.app/.netlify/functions/api',
  },
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false }
    return config
  }
}

module.exports = nextConfig
