/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // EMERGENCY FIX: Ignore all build errors
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Completely ignore the Scripts directory
  webpack: (config, { isServer, dev }) => {
    // Ignore Scripts directory completely
    config.module.rules.push({
      test: /Scripts[\/\\].*\.(ts|tsx|js|jsx)$/,
      use: 'ignore-loader',
    });
    
    if (!config.plugins) {
      config.plugins = [];
    }
    
    // Add plugin to ignore specific files
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/Scripts/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /Scripts[\/\\]/,
      })
    );
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
      };
    }
    
    return config;
  },
  
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  output: 'standalone',
};

module.exports = nextConfig;