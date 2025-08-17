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
  },
  output: "export",
  basePath: process.env.NODE_ENV === 'production' ? '/awesome-text-to-motion' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/awesome-text-to-motion/' : '',
  trailingSlash: true,
};

export default nextConfig;
