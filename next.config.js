/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

module.exports = nextConfig;
