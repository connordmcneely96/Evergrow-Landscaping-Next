import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static export for Cloudflare Pages
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'evergrowlandscaping.com',
        pathname: '/api/assets/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/api/assets/**',
      },
    ],
  },
  trailingSlash: true, // Better routing for static sites
};

export default nextConfig;
