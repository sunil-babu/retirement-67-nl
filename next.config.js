/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Ensure server runs on all interfaces in Docker
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
};
module.exports = nextConfig;
