import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Silence the "border" / "borderColor" shorthand React 19 warning
     that may still surface from third-party libs in dev mode. */
  reactStrictMode: true,

  /* Compress HTML/JS for smaller Vercel bundles */
  compress: true,

  /* Allow local images in /public — no remote patterns needed */
  images: {
    formats: ["image/avif", "image/webp"],
  },

  /* Remove X-Powered-By header */
  poweredByHeader: false,
};

export default nextConfig;
