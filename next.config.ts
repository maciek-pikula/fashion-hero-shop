import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/fashion-hero-shop",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
