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
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  basePath: '',
  assetPrefix: ''
}

module.exports = nextConfig
