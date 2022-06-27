import withOptimizedImages from 'next-optimized-images';

const nextConfig = withOptimizedImages({
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
});

export default nextConfig;
