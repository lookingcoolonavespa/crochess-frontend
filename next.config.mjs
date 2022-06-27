import { withPlugins } from 'next-compose-plugins';
import withOptimizedImages from 'next-optimized-images';

const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
};

export default withPlugins([withOptimizedImages], nextConfig);
