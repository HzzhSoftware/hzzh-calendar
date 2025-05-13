/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      unoptimized: true, // disables Image Optimization
      domains: ['lh3.googleusercontent.com'], // Add Google's avatar domain
    },
  }
  
  module.exports = nextConfig