/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://lendify-ai-api.netlify.app/.netlify/functions/api',
  },
  distDir: 'out',
  typescript: {
    ignoreBuildErrors: true
  },
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false }
    return config
  }
}

module.exports = nextConfig
