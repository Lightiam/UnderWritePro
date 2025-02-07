/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://lendify-ai-api.netlify.app/.netlify/functions/api',
  },
  typescript: {
    ignoreBuildErrors: true
  },
  trailingSlash: true,
  distDir: 'out',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx']
}

module.exports = nextConfig
