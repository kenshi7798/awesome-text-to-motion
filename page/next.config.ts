import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.shields.io',
      },
    ],
    unoptimized: true,
  },
  output: process.env.NODE_ENV === 'production' ? "export" : undefined,
  basePath: process.env.NODE_ENV === 'production' ? '/awesome-text-to-motion' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/awesome-text-to-motion/' : '',
  trailingSlash: process.env.NODE_ENV === 'production',
};

export default nextConfig;
