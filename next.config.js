/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://lendify-ai-api.netlify.app/.netlify/functions/api',
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true
  },
  distDir: 'out',
  experimental: {
    appDir: true
  },
  basePath: '',
  assetPrefix: '',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  rewrites: async () => {
    return [
      {
        source: '/chat',
        destination: '/chat/index.html',
      },
    ]
  }
}

module.exports = nextConfig
