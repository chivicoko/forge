import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Use Supabase's own image transformation API instead of Next.js proxy
    // This avoids the SSRF block on Supabase's IPv6-mapped CDN IPs
    loader: "custom",
    loaderFile: "./lib/supabase-image-loader.ts",
    // Keep remotePatterns as fallback for non-Supabase images
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
