import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    serverActions: {
      // Property photos are uploaded through a Server Action, and the default
      // 1MB cap rejects most phone camera images.
      bodySizeLimit: "6mb",
    },
  },
  images: {
    // Allow next/image to serve our own first-party SVG illustrations.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Allows all image paths from Cloudinary
      },
    ],
  },
};

export default nextConfig;
