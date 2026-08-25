import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phép điện thoại trong cùng mạng LAN
  // truy cập Next.js development resources
  allowedDevOrigins: [
    "192.168.1.8",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "iqbteqnoqrkvriniitcc.supabase.co",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;