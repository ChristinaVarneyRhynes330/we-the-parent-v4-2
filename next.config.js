// File: next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {};

// --- PWA CONFIGURATION (Feature 13) ---
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public', // Destination directory for the PWA files
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  register: true, // Register the service worker
  skipWaiting: true, // Install the new service worker immediately
});

module.exports = withPWA(nextConfig);