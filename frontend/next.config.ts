import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: {
    appIsrStatus: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
