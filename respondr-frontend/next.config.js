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
}
// next.config.js
const { withNetlify } = require('@netlify/next');

module.exports = withNetlify({
  reactStrictMode: true,
});


export default nextConfig
