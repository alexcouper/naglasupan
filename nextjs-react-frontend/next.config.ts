import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // Allow any HTTPS domain for user-uploaded screenshots
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      // Allow any HTTP domain for user-uploaded screenshots
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
