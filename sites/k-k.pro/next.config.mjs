/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 300,
  images: {
    domains: ['www.notion.so', 'notion.so', 'images.unsplash.com', 'pbs.twimg.com'],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
