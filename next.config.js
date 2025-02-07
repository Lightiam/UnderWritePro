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
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false }
    return config
  }
}

module.exports = nextConfig
