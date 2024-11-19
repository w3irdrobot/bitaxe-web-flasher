/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  ...(process.env.NODE_ENV === 'production' ? {
    basePath: '/bitaxe-web-flasher',
    assetPrefix: '/bitaxe-web-flasher',
  } : {}),
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig