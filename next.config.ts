import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.epidemicsound.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "audiocdn.epidemicsound.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
