/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["onei.lk", "images.weserv.nl", "wsrv.nl", "proxy.duckduckgo.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "onei.lk",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "onei.lk",
        pathname: "/wp-content/uploads/2025/05/**",
      },
      {
        protocol: "https",
        hostname: "images.weserv.nl",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wsrv.nl",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "proxy.duckduckgo.com",
        pathname: "/**",
      },
    ],
  },
  // Disable static generation for routes that use client-side features like useSearchParams
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Suppress client-side rendering warnings during build
  onDemandEntries: {
    // Silent mode
    quiet: true,
  },
};

export default nextConfig;
