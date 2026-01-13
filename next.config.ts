import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ["192.168.190.1"],
    },
  },
  reactCompiler: true,
};

export default nextConfig;
