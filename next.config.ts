import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.line-scdn.net",
      },
    ],
  },
};

export default nextConfig;
