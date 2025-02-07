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
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  trailingSlash: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/chat': { page: '/chat' }
    }
  }
}

module.exports = nextConfig
