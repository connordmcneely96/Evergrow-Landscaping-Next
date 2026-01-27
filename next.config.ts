import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Required for Cloudflare Pages
  },
  trailingSlash: true, // Better routing for static sites
};

export default nextConfig;
