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
  output: "export",
  basePath: '/awesome-text-to-motion',
  assetPrefix: '/awesome-text-to-motion/',
  trailingSlash: true,
};

export default nextConfig;
