import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local uploads directory
    localPatterns: [
      {
        pathname: "/uploads/**",
        search: "",
      },
    ],
    // Formats to serve
    formats: ["image/webp"],
  },
  // Increase body size limit for file uploads (50MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
