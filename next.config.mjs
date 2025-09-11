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
