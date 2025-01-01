/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  }
  // Remove the webpack config since we don't need OIDC fallback anymore
};

module.exports = nextConfig;