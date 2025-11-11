/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Note: This is for server actions, NOT API routes
      // API route CORS is handled in middleware.ts
      allowedOrigins: ['localhost:3000']
    }
  },
  serverExternalPackages: [
    '@boundaryml/baml',
    '@boundaryml/baml-darwin-x64',
    '@boundaryml/baml-darwin-arm64',
    'mongoose'
  ],
  // Use empty turbopack config to silence webpack warning
  turbopack: {},
  webpack: (config) => {
    // Handle canvas and other native dependencies for @react-pdf/renderer
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  }
};

export default nextConfig;
