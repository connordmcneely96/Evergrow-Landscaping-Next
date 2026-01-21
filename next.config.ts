import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static export for Cloudflare Pages
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better routing for static sites
  reactCompiler: true,
};

export default nextConfig;
