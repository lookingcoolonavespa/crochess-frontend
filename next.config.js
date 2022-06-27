const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

const nextConfig = withPlugins([
  [
    optimizedImages,
    {
      reactStrictMode: true,
      basePath: process.env.NEXT_PUBLIC_BASE_PATH,
      assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
    },
  ],
]);

module.exports = nextConfig;
