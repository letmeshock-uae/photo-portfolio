import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native modules that must not be bundled by webpack/Turbopack
  serverExternalPackages: ["sharp", "better-sqlite3", "@prisma/adapter-better-sqlite3"],

  images: {
    localPatterns: [
      { pathname: "/uploads/**", search: "" },
    ],
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
