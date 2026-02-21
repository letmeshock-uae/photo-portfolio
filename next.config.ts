import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native modules that must not be bundled by webpack/Turbopack
  serverExternalPackages: ["sharp", "better-sqlite3", "@prisma/adapter-better-sqlite3"],

  images: {
    localPatterns: [
      { pathname: "/uploads/**", search: "" },
    ],
    formats: ["image/webp"],
    // Allow any origin for production (Vercel Blob, S3, etc.)
    remotePatterns: [],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
