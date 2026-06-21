/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // pdf-parse, pdfjs-dist, and mammoth use Node.js native modules — must run in Node runtime, not Edge
  // NOTE: Next.js 14 uses experimental.serverComponentsExternalPackages (renamed in v15)
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'pdfjs-dist', 'mammoth'],
  },

  // Webpack config to handle pdf-parse test files (avoids "Can't resolve" warnings)
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
};

export default nextConfig;

