/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/Portfolio',
  assetPrefix: '/Portfolio/',
  trailingSlash: true,
  reactStrictMode: true,
};
module.exports = nextConfig;
