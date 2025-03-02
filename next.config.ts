import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  assetPrefix: '/farkle-game/',
  basePath: '/farkle-game',
};

export default nextConfig;
