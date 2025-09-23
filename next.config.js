/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The 'appDir' and 'swcMinify' options are now default in Next.js
  // The 'api' option is no longer needed for App Router Route Handlers

  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },

  webpack: (config) => {
    // Add custom webpack configuration if needed
    return config;
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  poweredByHeader: false,
};

module.exports = nextConfig;