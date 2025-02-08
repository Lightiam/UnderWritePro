/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  distDir: 'out',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  poweredByHeader: false,
  assetPrefix: '.',
  basePath: '',
  generateBuildId: () => 'build',
  experimental: {
    appDir: false
  }
}

module.exports = nextConfig
