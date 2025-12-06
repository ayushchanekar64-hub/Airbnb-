import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false, // Disable to reduce memory
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*']
  }
};

export default nextConfig;
