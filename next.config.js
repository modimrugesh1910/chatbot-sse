/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
    appDir: false
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
