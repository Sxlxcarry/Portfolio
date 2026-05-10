/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // basePath: '/portfolio', // décommente si déployé sur GitHub Pages dans un sous-chemin
  trailingSlash: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
