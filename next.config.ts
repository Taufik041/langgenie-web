import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow audio uploads up to 25 MB through route handlers
  experimental: { serverActions: { bodySizeLimit: "25mb" } },
};

export default nextConfig;
