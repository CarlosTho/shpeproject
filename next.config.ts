import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Used when you run `npm run dev:turbo` so the repo root is correct.
  turbopack: {
    root: projectRoot,
  },
  // Webpack dev: fewer watchers / less aggressive than default Turbopack on some Macs (fan/heat).
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules|\.git|src\/generated/,
      };
    }
    return config;
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
