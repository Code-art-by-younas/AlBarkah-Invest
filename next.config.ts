import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  serverExternalPackages: ["drizzle-orm", "pg", "bcryptjs", "jose"],
  experimental: {
    optimizePackageImports: ["react-icons", "date-fns", "lucide-react"],
  },
};

export default nextConfig;
